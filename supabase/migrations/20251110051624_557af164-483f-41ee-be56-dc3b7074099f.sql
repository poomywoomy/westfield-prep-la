-- Phase 4: Database integrity and performance fixes

-- Add unique constraint on webhook_id to prevent duplicate processing
CREATE UNIQUE INDEX IF NOT EXISTS idx_processed_webhooks_webhook_id 
ON processed_webhooks(webhook_id);

-- Verify critical indexes exist (these should already be present from prior migrations)
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_shopify_order 
ON inventory_ledger(shopify_order_id);

CREATE INDEX IF NOT EXISTS idx_inventory_ledger_client_sku 
ON inventory_ledger(client_id, sku_id);

CREATE INDEX IF NOT EXISTS idx_sku_aliases_lookup 
ON sku_aliases(alias_type, alias_value);

-- Add composite index for webhook idempotency checks (critical for performance)
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_idempotency 
ON inventory_ledger(client_id, sku_id, shopify_order_id, transaction_type) 
WHERE shopify_order_id IS NOT NULL;

-- Add index for faster sync config lookups
CREATE INDEX IF NOT EXISTS idx_shopify_sync_config_next_sync 
ON shopify_sync_config(auto_sync_enabled, next_sync_at) 
WHERE auto_sync_enabled = true;

-- Add index for webhook delivery logs by shop and topic
CREATE INDEX IF NOT EXISTS idx_webhook_delivery_logs_shop_topic 
ON webhook_delivery_logs(shop_domain, topic, created_at DESC);

-- Add index for shopify orders by client and fulfillment status
CREATE INDEX IF NOT EXISTS idx_shopify_orders_client_fulfillment 
ON shopify_orders(client_id, fulfillment_status);