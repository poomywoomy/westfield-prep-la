ALTER TABLE public.generated_documents 
ADD COLUMN minimum_spend_tier text,
ADD COLUMN setup_fee_refundable boolean DEFAULT false;