-- Phase 1: Add SALE_RESTOCK transaction type
ALTER TYPE ledger_type ADD VALUE IF NOT EXISTS 'SALE_RESTOCK';

-- Phase 3: Add last_shopify_sync_at column to sku_aliases
ALTER TABLE sku_aliases ADD COLUMN IF NOT EXISTS last_shopify_sync_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_sku_aliases_last_sync ON sku_aliases(last_shopify_sync_at);

-- Phase 1: Create database trigger for automatic Shopify sync
CREATE OR REPLACE FUNCTION trigger_shopify_inventory_sync()
RETURNS TRIGGER AS $$
DECLARE
  v_shopify_store_active BOOLEAN;
  v_last_sync_timestamp TIMESTAMPTZ;
  v_supabase_url TEXT;
  v_supabase_key TEXT;
BEGIN
  -- Check if client has active Shopify store
  SELECT EXISTS (
    SELECT 1 FROM shopify_stores 
    WHERE client_id = NEW.client_id 
    AND is_active = true
  ) INTO v_shopify_store_active;
  
  IF NOT v_shopify_store_active THEN
    RETURN NEW; -- Skip if no Shopify integration
  END IF;
  
  -- Debouncing: Check if SKU was synced in last 5 seconds
  -- (Prevents duplicate syncs when UI already called push function)
  SELECT MAX(created_at) INTO v_last_sync_timestamp
  FROM sync_logs
  WHERE client_id = NEW.client_id
    AND sync_type = 'inventory_push_single'
    AND status = 'success'
    AND created_at > NOW() - INTERVAL '5 seconds';
  
  IF v_last_sync_timestamp IS NOT NULL THEN
    -- Recently synced by UI, skip trigger
    RETURN NEW;
  END IF;
  
  -- Get Supabase credentials from environment
  v_supabase_url := current_setting('app.supabase_url', true);
  v_supabase_key := current_setting('app.supabase_anon_key', true);
  
  -- Only proceed if settings are configured
  IF v_supabase_url IS NOT NULL AND v_supabase_key IS NOT NULL THEN
    -- Call shopify-push-inventory-single via pg_net
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/shopify-push-inventory-single',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_supabase_key
      ),
      body := jsonb_build_object(
        'client_id', NEW.client_id::text,
        'sku_id', NEW.sku_id::text
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to inventory_ledger
DROP TRIGGER IF EXISTS inventory_ledger_shopify_sync ON inventory_ledger;
CREATE TRIGGER inventory_ledger_shopify_sync
  AFTER INSERT ON inventory_ledger
  FOR EACH ROW
  EXECUTE FUNCTION trigger_shopify_inventory_sync();