-- Add location-aware inventory function
CREATE OR REPLACE FUNCTION public.get_inventory_at_location(
  p_sku_id uuid,
  p_client_id uuid,
  p_location_id uuid
)
RETURNS integer
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(SUM(qty_delta), 0)::int
  FROM inventory_ledger 
  WHERE sku_id = p_sku_id 
    AND client_id = p_client_id 
    AND location_id = p_location_id
$function$;

-- Enforce unique aliases globally (Shopify IDs are unique across all clients)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_alias_global 
ON sku_aliases(alias_type, alias_value) 
WHERE alias_type IN ('shopify_inventory_item_id', 'shopify_variant_id');