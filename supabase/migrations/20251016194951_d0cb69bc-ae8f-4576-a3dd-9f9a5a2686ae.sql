-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_sync_logs_client_id ON sync_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook_id ON webhook_delivery_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_shopify_orders_client_id ON shopify_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sync_client_sku ON inventory_sync(client_id, sku);
CREATE INDEX IF NOT EXISTS idx_shopify_stores_client_id ON shopify_stores(client_id);
CREATE INDEX IF NOT EXISTS idx_shopify_stores_is_active ON shopify_stores(is_active);

-- Create shopify_webhooks table for tracking registered webhooks
CREATE TABLE IF NOT EXISTS public.shopify_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  webhook_id text NOT NULL,
  topic text NOT NULL,
  address text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE(client_id, webhook_id)
);

-- Enable RLS on shopify_webhooks
ALTER TABLE public.shopify_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS policies for shopify_webhooks
CREATE POLICY "Admins can manage all webhooks"
ON public.shopify_webhooks
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own webhooks"
ON public.shopify_webhooks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = shopify_webhooks.client_id
    AND clients.user_id = auth.uid()
  )
);

-- Add indexes for webhooks
CREATE INDEX IF NOT EXISTS idx_shopify_webhooks_client_id ON shopify_webhooks(client_id);
CREATE INDEX IF NOT EXISTS idx_shopify_webhooks_topic ON shopify_webhooks(topic);

-- Add cleanup function for old logs
CREATE OR REPLACE FUNCTION public.cleanup_old_sync_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM sync_logs WHERE created_at < NOW() - INTERVAL '90 days';
  DELETE FROM webhook_delivery_logs WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- Trigger for shopify_webhooks updated_at
CREATE TRIGGER update_shopify_webhooks_updated_at
BEFORE UPDATE ON public.shopify_webhooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();