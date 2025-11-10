-- Fix SECURITY DEFINER issue on remaining views
-- Set views to explicitly use SECURITY INVOKER mode
-- This ensures views execute with the querying user's permissions,
-- not the view creator's permissions, properly respecting RLS policies

ALTER VIEW public.inventory_summary_complete SET (security_invoker = true);
ALTER VIEW public.inventory_discrepancies_summary SET (security_invoker = true);