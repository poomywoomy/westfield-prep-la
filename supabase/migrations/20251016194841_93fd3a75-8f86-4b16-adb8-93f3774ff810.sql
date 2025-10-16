-- Create shopify_sync_config table
CREATE TABLE IF NOT EXISTS public.shopify_sync_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL UNIQUE REFERENCES public.clients(id) ON DELETE CASCADE,
  auto_sync_enabled boolean NOT NULL DEFAULT false,
  sync_frequency text NOT NULL DEFAULT 'daily',
  last_sync_at timestamp with time zone,
  last_sync_status text,
  last_sync_product_count integer DEFAULT 0,
  next_sync_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create sync_logs table
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  sync_type text NOT NULL,
  status text NOT NULL DEFAULT 'in_progress',
  products_synced integer DEFAULT 0,
  duration_ms integer,
  error_message text,
  triggered_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create webhook_delivery_logs table
CREATE TABLE IF NOT EXISTS public.webhook_delivery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id text,
  shop_domain text NOT NULL,
  topic text NOT NULL,
  status text NOT NULL,
  payload jsonb,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create inventory_sync table
CREATE TABLE IF NOT EXISTS public.inventory_sync (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  sku text NOT NULL,
  shopify_inventory_item_id text,
  westfield_quantity integer NOT NULL DEFAULT 0,
  shopify_quantity integer,
  sync_enabled boolean NOT NULL DEFAULT true,
  last_synced_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(client_id, sku)
);

-- Create shopify_orders table
CREATE TABLE IF NOT EXISTS public.shopify_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  shopify_order_id text NOT NULL,
  order_number text,
  customer_email text,
  customer_name text,
  total_price numeric,
  currency text,
  financial_status text,
  fulfillment_status text,
  line_items jsonb,
  shipping_address jsonb,
  created_at_shopify timestamp with time zone,
  updated_at_shopify timestamp with time zone,
  synced_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(client_id, shopify_order_id)
);

-- Enable RLS
ALTER TABLE public.shopify_sync_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopify_orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for shopify_sync_config
CREATE POLICY "Admins can manage all sync configs"
ON public.shopify_sync_config FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own sync config"
ON public.shopify_sync_config FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = shopify_sync_config.client_id AND clients.user_id = auth.uid()));

CREATE POLICY "Clients can update their own sync config"
ON public.shopify_sync_config FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = shopify_sync_config.client_id AND clients.user_id = auth.uid()));

-- RLS policies for sync_logs
CREATE POLICY "Admins can view all sync logs"
ON public.sync_logs FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own sync logs"
ON public.sync_logs FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = sync_logs.client_id AND clients.user_id = auth.uid()));

CREATE POLICY "System can insert sync logs"
ON public.sync_logs FOR INSERT TO authenticated
WITH CHECK (true);

-- RLS policies for webhook_delivery_logs
CREATE POLICY "Admins can view all webhook logs"
ON public.webhook_delivery_logs FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert webhook logs"
ON public.webhook_delivery_logs FOR INSERT TO authenticated
WITH CHECK (true);

-- RLS policies for inventory_sync
CREATE POLICY "Admins can manage all inventory sync"
ON public.inventory_sync FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own inventory sync"
ON public.inventory_sync FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = inventory_sync.client_id AND clients.user_id = auth.uid()));

-- RLS policies for shopify_orders
CREATE POLICY "Admins can manage all shopify orders"
ON public.shopify_orders FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own shopify orders"
ON public.shopify_orders FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = shopify_orders.client_id AND clients.user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_shopify_sync_config_updated_at
BEFORE UPDATE ON public.shopify_sync_config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_sync_updated_at
BEFORE UPDATE ON public.inventory_sync
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();