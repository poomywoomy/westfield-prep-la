-- Replace single statement_date with date range
ALTER TABLE public.bills DROP COLUMN IF EXISTS statement_date;
ALTER TABLE public.bills ADD COLUMN statement_start_date date;
ALTER TABLE public.bills ADD COLUMN statement_end_date date;

-- Add comments for clarity
COMMENT ON COLUMN public.bills.statement_start_date IS 'Start date of the billing statement period';
COMMENT ON COLUMN public.bills.statement_end_date IS 'End date of the billing statement period';
