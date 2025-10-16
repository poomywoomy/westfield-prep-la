-- Fix search_path for recalculate_quote_line_total function
-- This prevents potential privilege escalation via search_path manipulation

CREATE OR REPLACE FUNCTION public.recalculate_quote_line_total()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.line_total = NEW.unit_price * NEW.qty_actual;
  RETURN NEW;
END;
$$;
