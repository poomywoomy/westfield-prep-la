-- Add monthly billing cycles table
CREATE TABLE IF NOT EXISTS public.monthly_billing_cycles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  billing_month date NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked')),
  locked_at timestamp with time zone,
  total_amount numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(client_id, billing_month)
);

-- Add monthly line items table (stores quantities entered by admin)
CREATE TABLE IF NOT EXISTS public.monthly_billing_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id uuid NOT NULL REFERENCES public.monthly_billing_cycles(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  unit_price numeric NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL,
  section_type text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.monthly_billing_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_billing_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for monthly_billing_cycles
CREATE POLICY "Admins can manage all billing cycles"
ON public.monthly_billing_cycles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own billing cycles"
ON public.monthly_billing_cycles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = monthly_billing_cycles.client_id
    AND clients.user_id = auth.uid()
  )
);

-- RLS Policies for monthly_billing_items
CREATE POLICY "Admins can manage all billing items"
ON public.monthly_billing_items
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own billing items"
ON public.monthly_billing_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.monthly_billing_cycles mbc
    JOIN public.clients c ON c.id = mbc.client_id
    WHERE mbc.id = monthly_billing_items.cycle_id
    AND c.user_id = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_monthly_billing_cycles_updated_at
BEFORE UPDATE ON public.monthly_billing_cycles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_billing_items_updated_at
BEFORE UPDATE ON public.monthly_billing_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();