-- Fix security definer issue: Remove SECURITY DEFINER and let RLS handle access control
-- The RLS policies on inventory_ledger already filter by client ownership

DROP FUNCTION IF EXISTS sum_inventory_ledger(uuid, uuid);
DROP FUNCTION IF EXISTS get_current_inventory(uuid, uuid);

-- Recreate without SECURITY DEFINER - RLS policies will filter the data
CREATE OR REPLACE FUNCTION sum_inventory_ledger(p_sku_id uuid, p_client_id uuid)
RETURNS int AS $$
  SELECT COALESCE(SUM(qty_delta), 0)::int
  FROM inventory_ledger 
  WHERE sku_id = p_sku_id AND client_id = p_client_id
$$ LANGUAGE sql STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION get_current_inventory(p_sku_id uuid, p_client_id uuid)
RETURNS int AS $$
  SELECT COALESCE(SUM(qty_delta), 0)::int
  FROM inventory_ledger 
  WHERE sku_id = p_sku_id AND client_id = p_client_id
$$ LANGUAGE sql STABLE SET search_path = public;