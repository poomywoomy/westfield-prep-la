-- Add statement_date field to bills table
ALTER TABLE public.bills ADD COLUMN statement_date date;

-- Add comment for clarity
COMMENT ON COLUMN public.bills.statement_date IS 'The date shown on the bill statement (set manually by admin)';
