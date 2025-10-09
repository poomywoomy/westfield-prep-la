-- Create enum for fulfillment services
CREATE TYPE public.fulfillment_service AS ENUM (
  'fba_prep',
  'wfs_prep', 
  'tiktok_prep',
  'self_fulfilled',
  'storage',
  'returns_processing'
);

-- Add fulfillment services column to clients table
ALTER TABLE public.clients
ADD COLUMN fulfillment_services fulfillment_service[] DEFAULT '{}'::fulfillment_service[];