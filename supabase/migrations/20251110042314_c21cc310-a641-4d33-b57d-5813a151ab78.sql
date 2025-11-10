-- Add client_id to locations table for multi-tenant inventory management
ALTER TABLE locations ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX idx_locations_client_id ON locations(client_id);

-- Comment: Existing MAIN location will need to be assigned to clients
-- Admin can manually assign or each client will auto-create on first webhook