-- Add return-specific columns to asn_headers
ALTER TABLE public.asn_headers
ADD COLUMN IF NOT EXISTS is_return BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS return_carrier TEXT,
ADD COLUMN IF NOT EXISTS return_tracking TEXT,
ADD COLUMN IF NOT EXISTS return_marketplace TEXT,
ADD COLUMN IF NOT EXISTS consumer_name TEXT,
ADD COLUMN IF NOT EXISTS consumer_address TEXT,
ADD COLUMN IF NOT EXISTS consumer_order_number TEXT;

-- Create index for return ASNs
CREATE INDEX IF NOT EXISTS idx_asn_headers_is_return ON public.asn_headers(is_return) WHERE is_return = true;

-- Add removal_order source type handling
COMMENT ON COLUMN public.damaged_item_decisions.source_type IS 'Source type: receiving, return, removal_order, adjustment';