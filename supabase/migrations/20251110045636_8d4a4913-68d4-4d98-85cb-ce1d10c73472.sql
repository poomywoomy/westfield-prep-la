-- Phase 1: Critical Database & Infrastructure

-- Add unique constraint for client-location combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_locations_client_code 
ON locations(client_id, code) 
WHERE client_id IS NOT NULL;

-- Add composite indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_sku_order 
ON inventory_ledger(sku_id, shopify_order_id);

CREATE INDEX IF NOT EXISTS idx_inventory_ledger_source 
ON inventory_ledger(source_type, source_ref);

CREATE INDEX IF NOT EXISTS idx_sku_aliases_variant 
ON sku_aliases(alias_type, alias_value);

CREATE INDEX IF NOT EXISTS idx_inventory_ledger_client_sku 
ON inventory_ledger(client_id, sku_id);

-- Create webhook failure monitoring view
CREATE OR REPLACE VIEW webhook_recent_failures AS
SELECT 
  shop_domain,
  topic,
  status,
  error_message,
  created_at,
  webhook_id
FROM webhook_delivery_logs
WHERE status = 'failed'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;