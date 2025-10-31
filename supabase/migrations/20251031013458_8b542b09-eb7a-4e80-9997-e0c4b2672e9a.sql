-- Add payment_type to payments table for tracking deposit applications
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'regular_payment' CHECK (payment_type IN ('regular_payment', 'deposit_application', 'deposit_refund'));

-- Add section_type to bill_items if not exists (for grouping)
ALTER TABLE public.bill_items 
ALTER COLUMN section_type SET DEFAULT 'Standard Operations';

-- Create index for faster bill item queries by section
CREATE INDEX IF NOT EXISTS idx_bill_items_section_type ON public.bill_items(section_type);

-- Create index for faster payment queries
CREATE INDEX IF NOT EXISTS idx_payments_bill_id ON public.payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON public.payments(client_id);