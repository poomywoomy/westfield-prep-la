-- Add storage_method column to clients table
ALTER TABLE public.clients
ADD COLUMN storage_method text CHECK (storage_method IN ('shelf_storage', 'cubic_foot_storage'));