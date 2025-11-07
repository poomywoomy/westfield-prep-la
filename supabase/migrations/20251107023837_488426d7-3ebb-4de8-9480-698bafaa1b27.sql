-- Update discrepancy status values and add new columns
UPDATE damaged_item_decisions 
SET status = 'processed' 
WHERE status = 'submitted';

-- Add new columns for admin workflow
ALTER TABLE damaged_item_decisions 
ADD COLUMN IF NOT EXISTS admin_closed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_closed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reopened_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_close_notes TEXT;

-- Add source tracking to inventory_ledger for Shopify integration
ALTER TABLE inventory_ledger 
ADD COLUMN IF NOT EXISTS shopify_order_id TEXT,
ADD COLUMN IF NOT EXISTS shopify_fulfillment_id TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_shopify 
ON inventory_ledger(shopify_order_id) 
WHERE shopify_order_id IS NOT NULL;

-- Create index for pending discrepancies count
CREATE INDEX IF NOT EXISTS idx_damaged_decisions_pending 
ON damaged_item_decisions(status, client_id) 
WHERE status = 'pending';