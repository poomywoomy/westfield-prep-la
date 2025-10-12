-- Create payments/deposits table
CREATE TABLE public.billing_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  cycle_id UUID NOT NULL,
  payment_name TEXT NOT NULL DEFAULT 'Deposit',
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  payment_method TEXT NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add type field to monthly_billing_items to distinguish quote items from custom entries
ALTER TABLE public.monthly_billing_items
ADD COLUMN item_type TEXT NOT NULL DEFAULT 'quote';

-- Enable RLS
ALTER TABLE public.billing_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for billing_payments
CREATE POLICY "Admins can manage all payments"
ON public.billing_payments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own payments"
ON public.billing_payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = billing_payments.client_id
    AND clients.user_id = auth.uid()
  )
);

-- Update trigger for billing_payments
CREATE TRIGGER update_billing_payments_updated_at
BEFORE UPDATE ON public.billing_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();