-- Add unique constraint to prevent duplicate bills for same client+month
ALTER TABLE public.bills 
ADD CONSTRAINT bills_client_month_unique 
UNIQUE (client_id, billing_month);