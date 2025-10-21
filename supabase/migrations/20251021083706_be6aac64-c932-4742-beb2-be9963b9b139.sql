-- Remove old unused receiving system tables
-- These tables are replaced by the ASN-based receiving workflow

DROP TABLE IF EXISTS public.prep_tasks CASCADE;
DROP TABLE IF EXISTS public.receiving_items CASCADE;
DROP TABLE IF EXISTS public.shipment_items CASCADE;
DROP TABLE IF EXISTS public.receivings CASCADE;
DROP TABLE IF EXISTS public.shipments CASCADE;

COMMENT ON SCHEMA public IS 'Old receiving tables removed - ASN-based receiving system now active';