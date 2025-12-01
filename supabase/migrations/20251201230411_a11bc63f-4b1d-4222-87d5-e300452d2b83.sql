-- Add marketplace tracking to outbound_shipments
ALTER TABLE public.outbound_shipments 
ADD COLUMN IF NOT EXISTS marketplace TEXT,
ADD COLUMN IF NOT EXISTS marketplace_other TEXT,
ADD COLUMN IF NOT EXISTS shipment_format TEXT DEFAULT 'carton';

-- Add custom marketplaces storage to clients
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS custom_marketplaces TEXT[] DEFAULT '{}'::TEXT[];