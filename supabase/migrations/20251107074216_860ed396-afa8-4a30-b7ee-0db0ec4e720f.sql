-- Add Shopify order tracking columns to bill_items
ALTER TABLE bill_items
ADD COLUMN shopify_order_id TEXT,
ADD COLUMN fulfillment_id TEXT;

-- Add index for faster queries
CREATE INDEX idx_bill_items_shopify_order 
ON bill_items(shopify_order_id) 
WHERE shopify_order_id IS NOT NULL;

-- Create prep center configuration table
CREATE TABLE prep_center_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on prep_center_config
ALTER TABLE prep_center_config ENABLE ROW LEVEL SECURITY;

-- Admins can manage config
CREATE POLICY "Admins can manage prep center config"
ON prep_center_config
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can read config
CREATE POLICY "Everyone can read prep center config"
ON prep_center_config
FOR SELECT
TO authenticated
USING (true);

-- Insert default prep center shipping address
INSERT INTO prep_center_config (config_key, config_value) VALUES
('default_shipping_address', '{
  "name": "Westfield Prep Center",
  "address1": "Your Address Line 1",
  "address2": "Suite/Unit",
  "city": "Los Angeles",
  "province": "CA",
  "postal_code": "90001",
  "country": "US",
  "phone": "818-935-5478"
}'::jsonb);

-- Add trigger for updated_at
CREATE TRIGGER update_prep_center_config_updated_at
BEFORE UPDATE ON prep_center_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();