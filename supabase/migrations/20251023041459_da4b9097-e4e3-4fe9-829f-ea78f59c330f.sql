-- Fix SECURITY DEFINER issue on inventory_discrepancies_summary view
-- Set the view to explicitly use SECURITY INVOKER mode
-- This ensures the view executes with the querying user's permissions,
-- not the view creator's permissions, properly respecting RLS policies

ALTER VIEW public.inventory_discrepancies_summary SET (security_invoker = true);