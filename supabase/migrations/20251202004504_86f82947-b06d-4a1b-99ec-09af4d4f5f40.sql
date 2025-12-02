-- Add shipment_request_id column to link outbound shipments to shipment requests
ALTER TABLE public.outbound_shipments 
ADD COLUMN IF NOT EXISTS shipment_request_id UUID REFERENCES public.shipment_requests(id) ON DELETE SET NULL;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_outbound_shipments_request_id ON public.outbound_shipments(shipment_request_id);