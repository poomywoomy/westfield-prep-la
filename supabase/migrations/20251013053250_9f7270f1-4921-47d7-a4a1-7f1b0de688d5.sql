-- Create shipments table
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  shipment_ref TEXT NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shipment_items table
CREATE TABLE public.shipment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  product_name TEXT,
  expected_qty INTEGER NOT NULL DEFAULT 0,
  received_qty INTEGER NOT NULL DEFAULT 0,
  damaged_qty INTEGER NOT NULL DEFAULT 0,
  missing_qty INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prep status enum
CREATE TYPE public.prep_status AS ENUM ('awaiting', 'in_progress', 'ready');

-- Create prep_tasks table
CREATE TABLE public.prep_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_item_id UUID NOT NULL REFERENCES public.shipment_items(id) ON DELETE CASCADE,
  status public.prep_status NOT NULL DEFAULT 'awaiting',
  prepped_qty INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  number TEXT NOT NULL UNIQUE,
  amount_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  sku TEXT,
  description TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create report_jobs table
CREATE TABLE public.report_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  pdf_url TEXT,
  emailed BOOLEAN NOT NULL DEFAULT false,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prep_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipments
CREATE POLICY "Admins can manage all shipments"
ON public.shipments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own shipments"
ON public.shipments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM clients WHERE clients.id = shipments.client_id AND clients.user_id = auth.uid()
));

-- RLS Policies for shipment_items
CREATE POLICY "Admins can manage all shipment items"
ON public.shipment_items FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own shipment items"
ON public.shipment_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM shipments s
  JOIN clients c ON c.id = s.client_id
  WHERE s.id = shipment_items.shipment_id AND c.user_id = auth.uid()
));

-- RLS Policies for prep_tasks
CREATE POLICY "Admins can manage all prep tasks"
ON public.prep_tasks FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own prep tasks"
ON public.prep_tasks FOR SELECT
USING (EXISTS (
  SELECT 1 FROM shipment_items si
  JOIN shipments s ON s.id = si.shipment_id
  JOIN clients c ON c.id = s.client_id
  WHERE si.id = prep_tasks.shipment_item_id AND c.user_id = auth.uid()
));

-- RLS Policies for invoices
CREATE POLICY "Admins can manage all invoices"
ON public.invoices FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own invoices"
ON public.invoices FOR SELECT
USING (EXISTS (
  SELECT 1 FROM clients WHERE clients.id = invoices.client_id AND clients.user_id = auth.uid()
));

-- RLS Policies for invoice_items
CREATE POLICY "Admins can manage all invoice items"
ON public.invoice_items FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own invoice items"
ON public.invoice_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM invoices i
  JOIN clients c ON c.id = i.client_id
  WHERE i.id = invoice_items.invoice_id AND c.user_id = auth.uid()
));

-- RLS Policies for report_jobs
CREATE POLICY "Admins can manage all report jobs"
ON public.report_jobs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own report jobs"
ON public.report_jobs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM clients WHERE clients.id = report_jobs.client_id AND clients.user_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_shipments_client_id ON public.shipments(client_id);
CREATE INDEX idx_shipments_received_at ON public.shipments(received_at);
CREATE INDEX idx_shipment_items_shipment_id ON public.shipment_items(shipment_id);
CREATE INDEX idx_shipment_items_sku ON public.shipment_items(sku);
CREATE INDEX idx_prep_tasks_shipment_item_id ON public.prep_tasks(shipment_item_id);
CREATE INDEX idx_prep_tasks_status ON public.prep_tasks(status);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_created_at ON public.invoices(created_at);
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_sku ON public.invoice_items(sku);
CREATE INDEX idx_report_jobs_client_id ON public.report_jobs(client_id);

-- Triggers for updated_at
CREATE TRIGGER update_shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipment_items_updated_at
BEFORE UPDATE ON public.shipment_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prep_tasks_updated_at
BEFORE UPDATE ON public.prep_tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();