-- Phase 3: Add metadata column to sync_logs for pagination state
ALTER TABLE sync_logs ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_sync_logs_metadata ON sync_logs USING gin(metadata);

-- Phase 5: Normalize fulfillment IDs (remove GID format, keep only numeric)
UPDATE inventory_ledger
SET shopify_fulfillment_id = split_part(shopify_fulfillment_id, '/', 5)
WHERE shopify_fulfillment_id LIKE 'gid://shopify/Fulfillment/%';

COMMENT ON COLUMN inventory_ledger.shopify_fulfillment_id IS 
  'Numeric ID only (e.g., 123), not GID format';