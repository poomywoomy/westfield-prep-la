-- Create shipment_requests table for client-initiated shipment requests
CREATE TABLE public.shipment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  requested_ship_date DATE NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID,
  admin_notes TEXT
);

-- Create shipment_request_lines table for SKUs in each request
CREATE TABLE public.shipment_request_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.shipment_requests(id) ON DELETE CASCADE,
  sku_id UUID NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create support_tickets table for client support requests
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  issue_category TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  preferred_contact_method TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  admin_notes TEXT
);

-- Enable RLS
ALTER TABLE public.shipment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_request_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipment_requests
CREATE POLICY "Admins can manage all shipment requests"
ON public.shipment_requests
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can create their own shipment requests"
ON public.shipment_requests
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = shipment_requests.client_id
    AND clients.user_id = auth.uid()
  )
);

CREATE POLICY "Clients can view their own shipment requests"
ON public.shipment_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = shipment_requests.client_id
    AND clients.user_id = auth.uid()
  )
);

-- RLS Policies for shipment_request_lines
CREATE POLICY "Admins can manage all shipment request lines"
ON public.shipment_request_lines
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.shipment_requests
    WHERE shipment_requests.id = shipment_request_lines.request_id
    AND has_role(auth.uid(), 'admin'::app_role)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.shipment_requests
    WHERE shipment_requests.id = shipment_request_lines.request_id
    AND has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Clients can create lines for their own requests"
ON public.shipment_request_lines
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.shipment_requests sr
    JOIN public.clients c ON c.id = sr.client_id
    WHERE sr.id = shipment_request_lines.request_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Clients can view lines for their own requests"
ON public.shipment_request_lines
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.shipment_requests sr
    JOIN public.clients c ON c.id = sr.client_id
    WHERE sr.id = shipment_request_lines.request_id
    AND c.user_id = auth.uid()
  )
);

-- RLS Policies for support_tickets
CREATE POLICY "Admins can manage all support tickets"
ON public.support_tickets
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can create their own support tickets"
ON public.support_tickets
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = support_tickets.client_id
    AND clients.user_id = auth.uid()
  )
);

CREATE POLICY "Clients can view their own support tickets"
ON public.support_tickets
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = support_tickets.client_id
    AND clients.user_id = auth.uid()
  )
);

-- Create indexes for performance
CREATE INDEX idx_shipment_requests_client_id ON public.shipment_requests(client_id);
CREATE INDEX idx_shipment_requests_status ON public.shipment_requests(status);
CREATE INDEX idx_shipment_request_lines_request_id ON public.shipment_request_lines(request_id);
CREATE INDEX idx_support_tickets_client_id ON public.support_tickets(client_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);

-- Add updated_at trigger for shipment_requests
CREATE TRIGGER update_shipment_requests_updated_at
  BEFORE UPDATE ON public.shipment_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for support_tickets
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();