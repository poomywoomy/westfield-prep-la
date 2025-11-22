-- Phase 1: Add location tracking columns to sync_logs table
ALTER TABLE public.sync_logs 
ADD COLUMN IF NOT EXISTS location_id_used TEXT,
ADD COLUMN IF NOT EXISTS location_source TEXT CHECK (location_source IN ('manual', 'auto_selected', 'unknown'));

COMMENT ON COLUMN public.sync_logs.location_id_used IS 'Shopify location ID used for this sync operation';
COMMENT ON COLUMN public.sync_logs.location_source IS 'Whether location was manually set by admin or auto-selected by system';