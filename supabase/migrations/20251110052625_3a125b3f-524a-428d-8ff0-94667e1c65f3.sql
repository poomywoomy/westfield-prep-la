-- Phase 1 & 2: Critical indexes and functions for performance and data integrity

-- Phase 1: Performance indexes
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_source_ref 
ON inventory_ledger(source_ref, sku_id, transaction_type) 
WHERE source_ref IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sku_aliases_sku_id 
ON sku_aliases(sku_id);

-- Phase 2: Inventory calculation functions
CREATE OR REPLACE FUNCTION sum_inventory_ledger(p_sku_id uuid, p_client_id uuid)
RETURNS int AS $$
  SELECT COALESCE(SUM(qty_delta), 0)::int
  FROM inventory_ledger 
  WHERE sku_id = p_sku_id AND client_id = p_client_id
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_current_inventory(p_sku_id uuid, p_client_id uuid)
RETURNS int AS $$
  SELECT COALESCE(SUM(qty_delta), 0)::int
  FROM inventory_ledger 
  WHERE sku_id = p_sku_id AND client_id = p_client_id
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;