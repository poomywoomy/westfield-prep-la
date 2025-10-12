-- Add manual statement date range to billing cycles
ALTER TABLE public.monthly_billing_cycles
  ADD COLUMN IF NOT EXISTS statement_start_date date,
  ADD COLUMN IF NOT EXISTS statement_end_date date;

-- Backfill existing rows based on billing_month if range is missing
UPDATE public.monthly_billing_cycles
SET 
  statement_start_date = COALESCE(statement_start_date, date_trunc('month', billing_month)::date),
  statement_end_date = COALESCE(statement_end_date, (date_trunc('month', billing_month) + interval '1 month - 1 day')::date)
WHERE billing_month IS NOT NULL;