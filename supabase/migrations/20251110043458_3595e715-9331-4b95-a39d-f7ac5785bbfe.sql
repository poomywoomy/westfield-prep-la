-- Phase 1.1: Backfill client_id for MAIN location
-- This ensures the MAIN location is associated with the client
UPDATE locations
SET client_id = (SELECT id FROM clients LIMIT 1)
WHERE code = 'MAIN' AND client_id IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN locations.client_id IS 'Associates location with a client. NULL for shared locations, specific client_id for client-owned locations.';