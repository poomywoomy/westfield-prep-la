-- Create table for tracking compliance webhook events
CREATE TABLE public.compliance_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_type text NOT NULL CHECK (webhook_type IN ('data_request', 'customer_redact', 'shop_redact')),
  shop_domain text NOT NULL,
  payload jsonb NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_webhooks ENABLE ROW LEVEL SECURITY;

-- Only admins can view compliance webhooks
CREATE POLICY "Admins can view compliance webhooks"
  ON public.compliance_webhooks
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert compliance webhooks
CREATE POLICY "System can insert compliance webhooks"
  ON public.compliance_webhooks
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Admins can update processed status
CREATE POLICY "Admins can update compliance webhooks"
  ON public.compliance_webhooks
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_compliance_webhooks_shop_domain ON public.compliance_webhooks(shop_domain);
CREATE INDEX idx_compliance_webhooks_processed ON public.compliance_webhooks(processed) WHERE NOT processed;