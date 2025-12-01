-- Update default ship_from_address to generic Los Angeles
ALTER TABLE public.outbound_shipments 
ALTER COLUMN ship_from_address SET DEFAULT 'Los Angeles, CA';