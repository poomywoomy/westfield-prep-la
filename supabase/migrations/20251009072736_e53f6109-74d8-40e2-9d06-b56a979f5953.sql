-- Drop and recreate the fulfillment_service enum with updated values
DROP TYPE IF EXISTS public.fulfillment_service CASCADE;

CREATE TYPE public.fulfillment_service AS ENUM (
  'fba_prep',
  'wfs_prep', 
  'tiktok_prep',
  'self_fulfilled',
  'shopify',
  'returns_processing'
);

-- Recreate the column with the new enum type
ALTER TABLE public.clients
DROP COLUMN IF EXISTS fulfillment_services;

ALTER TABLE public.clients
ADD COLUMN fulfillment_services fulfillment_service[] DEFAULT '{}'::fulfillment_service[];