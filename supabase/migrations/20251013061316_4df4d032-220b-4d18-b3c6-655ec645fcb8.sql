-- Create client_skus table
CREATE TABLE IF NOT EXISTS public.client_skus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  product_name TEXT,
  default_service_type TEXT,
  default_unit_price NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, sku)
);

-- Enable RLS on client_skus
ALTER TABLE public.client_skus ENABLE ROW LEVEL SECURITY;

-- RLS policies for client_skus
CREATE POLICY "Admins can manage all client SKUs"
  ON public.client_skus
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own SKUs"
  ON public.client_skus
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = client_skus.client_id
    AND clients.user_id = auth.uid()
  ));

CREATE POLICY "Clients can insert their own SKUs"
  ON public.client_skus
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = client_skus.client_id
    AND clients.user_id = auth.uid()
  ));

-- Add trigger for updated_at
CREATE TRIGGER update_client_skus_updated_at
  BEFORE UPDATE ON public.client_skus
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_client_skus_client_id ON public.client_skus(client_id);
CREATE INDEX idx_client_skus_sku ON public.client_skus(sku);