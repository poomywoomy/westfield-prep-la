-- Add pricing document URL column to clients table
ALTER TABLE public.clients
ADD COLUMN pricing_document_url text;

COMMENT ON COLUMN public.clients.pricing_document_url IS 'URL to the uploaded pricing document for the client';