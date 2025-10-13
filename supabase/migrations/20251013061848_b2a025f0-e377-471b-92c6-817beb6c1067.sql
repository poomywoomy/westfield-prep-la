-- Enable realtime for billing tables
ALTER TABLE public.billing_payments REPLICA IDENTITY FULL;
ALTER TABLE public.monthly_billing_items REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.billing_payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.monthly_billing_items;