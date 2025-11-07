-- Create view that shows ALL SKUs including those with 0 inventory
CREATE OR REPLACE VIEW inventory_summary_complete AS
SELECT 
  s.client_id,
  s.id as sku_id,
  s.client_sku,
  s.title,
  s.fnsku,
  COALESCE(inv.location_id, (SELECT id FROM locations WHERE code = 'MAIN' LIMIT 1)) as location_id,
  COALESCE(loc.name, 'Main Warehouse') as location_name,
  COALESCE(inv.on_hand, 0) as on_hand,
  COALESCE(inv.reserved, 0) as reserved,
  COALESCE(inv.available, 0) as available
FROM skus s
LEFT JOIN inventory_summary inv ON inv.sku_id = s.id
LEFT JOIN locations loc ON loc.id = inv.location_id
WHERE s.status = 'active';

-- Add RLS policy for the view
ALTER VIEW inventory_summary_complete SET (security_invoker = true);