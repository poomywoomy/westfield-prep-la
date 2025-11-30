-- Add marketplace and shipment_type columns to shipment_requests
ALTER TABLE shipment_requests 
ADD COLUMN marketplace TEXT,
ADD COLUMN marketplace_other TEXT,
ADD COLUMN shipment_type TEXT DEFAULT 'carton';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shipment_requests_marketplace ON shipment_requests(marketplace);
CREATE INDEX IF NOT EXISTS idx_shipment_requests_shipment_type ON shipment_requests(shipment_type);