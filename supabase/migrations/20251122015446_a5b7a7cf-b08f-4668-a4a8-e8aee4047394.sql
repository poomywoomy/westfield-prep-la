-- Fix security warning: Add explicit search_path to trigger function
CREATE OR REPLACE FUNCTION public.trigger_shopify_inventory_sync()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shopify_store_active BOOLEAN;
  v_last_sync_timestamp TIMESTAMPTZ;
  v_supabase_url TEXT;
  v_supabase_key TEXT;
BEGIN
  -- Check if client has active Shopify store
  SELECT EXISTS (
    SELECT 1 FROM public.shopify_stores 
    WHERE client_id = NEW.client_id 
    AND is_active = true
  ) INTO v_shopify_store_active;
  
  IF NOT v_shopify_store_active THEN
    RETURN NEW;
  END IF;
  
  -- Debouncing: Check if SKU was synced in last 5 seconds
  SELECT MAX(created_at) INTO v_last_sync_timestamp
  FROM public.sync_logs
  WHERE client_id = NEW.client_id
    AND sync_type = 'inventory_push_single'
    AND status = 'success'
    AND created_at > NOW() - INTERVAL '5 seconds';
  
  IF v_last_sync_timestamp IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get Supabase credentials
  v_supabase_url := current_setting('app.supabase_url', true);
  v_supabase_key := current_setting('app.supabase_anon_key', true);
  
  -- Call shopify-push-inventory-single via pg_net
  IF v_supabase_url IS NOT NULL AND v_supabase_key IS NOT NULL THEN
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
$$;