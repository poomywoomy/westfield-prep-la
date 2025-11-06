-- Phase 1: Add Low Stock Alert Fields
ALTER TABLE clients ADD COLUMN IF NOT EXISTS default_low_stock_threshold INTEGER DEFAULT 10;

-- Add per-SKU override for low stock threshold
ALTER TABLE skus ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NULL;

-- Phase 2: Add Source Tracking to Discrepancies
ALTER TABLE damaged_item_decisions ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'receiving';

COMMENT ON COLUMN damaged_item_decisions.source_type IS 'Values: receiving or return';
COMMENT ON COLUMN clients.default_low_stock_threshold IS 'Default low stock threshold for all client SKUs';
COMMENT ON COLUMN skus.low_stock_threshold IS 'Per-SKU override for low stock threshold (inherits from client if NULL)';