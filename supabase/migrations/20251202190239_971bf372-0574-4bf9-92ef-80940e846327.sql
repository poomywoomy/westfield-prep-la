-- Create removal_orders table
CREATE TABLE public.removal_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  removal_order_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  received_by UUID REFERENCES auth.users(id),
  notes TEXT,
  qc_photo_urls TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create removal_order_lines table
CREATE TABLE public.removal_order_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  removal_order_id UUID NOT NULL REFERENCES public.removal_orders(id) ON DELETE CASCADE,
  sku_id UUID NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  expected_qty INTEGER NOT NULL DEFAULT 0,
  received_qty INTEGER NOT NULL DEFAULT 0,
  decision TEXT,
  client_notes TEXT,
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.removal_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.removal_order_lines ENABLE ROW LEVEL SECURITY;

-- RLS policies for removal_orders
CREATE POLICY "Admins can manage all removal orders"
ON public.removal_orders FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own removal orders"
ON public.removal_orders FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM clients WHERE clients.id = removal_orders.client_id AND clients.user_id = auth.uid()
));

CREATE POLICY "Clients can update their own pending removal orders"
ON public.removal_orders FOR UPDATE TO authenticated
USING (
  status = 'pending' AND 
  EXISTS (SELECT 1 FROM clients WHERE clients.id = removal_orders.client_id AND clients.user_id = auth.uid())
);

-- RLS policies for removal_order_lines
CREATE POLICY "Admins can manage all removal order lines"
ON public.removal_order_lines FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own removal order lines"
ON public.removal_order_lines FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM removal_orders ro
  JOIN clients c ON c.id = ro.client_id
  WHERE ro.id = removal_order_lines.removal_order_id AND c.user_id = auth.uid()
));

CREATE POLICY "Clients can update their own pending removal order lines"
ON public.removal_order_lines FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM removal_orders ro
  JOIN clients c ON c.id = ro.client_id
  WHERE ro.id = removal_order_lines.removal_order_id 
  AND ro.status = 'pending'
  AND c.user_id = auth.uid()
));

-- Generate removal order number function
CREATE OR REPLACE FUNCTION public.generate_removal_order_number(p_client_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_client_code TEXT;
  v_year_month TEXT;
  v_sequence INT;
  v_number TEXT;
BEGIN
  SELECT UPPER(LEFT(REGEXP_REPLACE(company_name, '[^A-Za-z]', '', 'g'), 3))
  INTO v_client_code
  FROM clients WHERE id = p_client_id;
  
  v_year_month := TO_CHAR(NOW(), 'YYYYMM');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(removal_order_number FROM '.*-(\d+)$') AS INTEGER)
  ), 0) + 1
  INTO v_sequence
  FROM removal_orders
  WHERE client_id = p_client_id
  AND removal_order_number LIKE v_client_code || '-RO-' || v_year_month || '-%';
  
  v_number := v_client_code || '-RO-' || v_year_month || '-' || LPAD(v_sequence::TEXT, 3, '0');
  
  RETURN v_number;
END;
$$;