-- Fix custom_pricing unique constraint to allow same service name in different sections
ALTER TABLE custom_pricing 
DROP CONSTRAINT IF EXISTS custom_pricing_client_id_service_name_key;

-- Add new composite constraint including section_type
ALTER TABLE custom_pricing 
ADD CONSTRAINT custom_pricing_client_id_service_name_section_key 
UNIQUE (client_id, service_name, section_type);