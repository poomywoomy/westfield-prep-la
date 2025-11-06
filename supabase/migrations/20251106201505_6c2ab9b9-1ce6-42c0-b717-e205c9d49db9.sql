-- Add fulfillment order tracking to shopify_orders
ALTER TABLE shopify_orders 
ADD COLUMN IF NOT EXISTS fulfillment_order_id TEXT;

-- Add single location ID to clients (stores which Shopify location this client uses)
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS shopify_location_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_shopify_orders_fulfillment_order_id ON shopify_orders(fulfillment_order_id);
CREATE INDEX IF NOT EXISTS idx_clients_shopify_location_id ON clients(shopify_location_id);