-- Drop old inventory tables
DROP TABLE IF EXISTS public.client_skus CASCADE;
DROP TABLE IF EXISTS public.inventory_sync CASCADE;

-- Create enum types
CREATE TYPE public.asn_status AS ENUM ('draft', 'in_progress', 'received', 'closed');
CREATE TYPE public.condition_type AS ENUM ('normal', 'damaged', 'quarantined', 'rework');
CREATE TYPE public.ledger_type AS ENUM ('RECEIPT', 'ADJUSTMENT_PLUS', 'ADJUSTMENT_MINUS', 'SALE_DECREMENT', 'RETURN', 'TRANSFER', 'RESERVE', 'RELEASE');

-- Locations table (single MAIN location for now)
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default MAIN location
INSERT INTO public.locations (name, code) VALUES ('Main Warehouse', 'MAIN');

-- SKUs table (replaces client_skus with enhanced fields)
CREATE TABLE public.skus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_sku TEXT NOT NULL,
  fnsku TEXT,
  asin TEXT,
  upc TEXT,
  ean TEXT,
  title TEXT NOT NULL,
  brand TEXT,
  unit_cost NUMERIC(10,2),
  weight NUMERIC(10,2),
  length NUMERIC(10,2),
  width NUMERIC(10,2),
  height NUMERIC(10,2),
  prep_requirements JSONB DEFAULT '{}',
  has_expiration BOOLEAN NOT NULL DEFAULT false,
  has_lot_tracking BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, client_sku)
);

-- SKU aliases for multiple identifier mappings
CREATE TABLE public.sku_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id UUID NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  alias_type TEXT NOT NULL,
  alias_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(sku_id, alias_type, alias_value)
);

-- ASN headers (inbound shipments)
CREATE TABLE public.asn_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  asn_number TEXT NOT NULL,
  carrier TEXT,
  tracking_number TEXT,
  eta DATE,
  ship_from TEXT,
  notes TEXT,
  status asn_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  received_by UUID REFERENCES auth.users(id),
  received_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, asn_number)
);

-- ASN lines (expected vs received per SKU)
CREATE TABLE public.asn_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asn_id UUID NOT NULL REFERENCES public.asn_headers(id) ON DELETE CASCADE,
  sku_id UUID NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  expected_units INTEGER NOT NULL DEFAULT 0,
  received_units INTEGER NOT NULL DEFAULT 0,
  normal_units INTEGER NOT NULL DEFAULT 0,
  damaged_units INTEGER NOT NULL DEFAULT 0,
  quarantined_units INTEGER NOT NULL DEFAULT 0,
  rework_units INTEGER NOT NULL DEFAULT 0,
  reserved_units INTEGER NOT NULL DEFAULT 0,
  lot_number TEXT,
  expiry_date DATE,
  service_ticks JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inventory ledger (immutable transaction log)
CREATE TABLE public.inventory_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  sku_id UUID NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  lot_number TEXT,
  expiry_date DATE,
  qty_delta INTEGER NOT NULL,
  transaction_type ledger_type NOT NULL,
  reason_code TEXT,
  notes TEXT,
  source_ref UUID,
  source_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Attachments for ASNs and evidence photos
CREATE TABLE public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL,
  owner_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  retention_days INTEGER DEFAULT 5,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_skus_client ON public.skus(client_id);
CREATE INDEX idx_skus_status ON public.skus(status);
CREATE INDEX idx_sku_aliases_sku ON public.sku_aliases(sku_id);
CREATE INDEX idx_asn_headers_client ON public.asn_headers(client_id);
CREATE INDEX idx_asn_headers_status ON public.asn_headers(status);
CREATE INDEX idx_asn_lines_asn ON public.asn_lines(asn_id);
CREATE INDEX idx_asn_lines_sku ON public.asn_lines(sku_id);
CREATE INDEX idx_ledger_client_sku ON public.inventory_ledger(client_id, sku_id);
CREATE INDEX idx_ledger_ts ON public.inventory_ledger(ts DESC);
CREATE INDEX idx_attachments_owner ON public.attachments(owner_type, owner_id);

-- Create triggers for updated_at
CREATE TRIGGER update_skus_updated_at BEFORE UPDATE ON public.skus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_asn_headers_updated_at BEFORE UPDATE ON public.asn_headers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_asn_lines_updated_at BEFORE UPDATE ON public.asn_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create inventory summary view
CREATE OR REPLACE VIEW public.inventory_summary AS
SELECT 
  l.client_id,
  l.sku_id,
  s.client_sku,
  s.title,
  s.fnsku,
  l.location_id,
  loc.name as location_name,
  SUM(CASE WHEN l.transaction_type IN ('RECEIPT', 'ADJUSTMENT_PLUS', 'RETURN', 'RELEASE') THEN l.qty_delta
           WHEN l.transaction_type IN ('ADJUSTMENT_MINUS', 'SALE_DECREMENT', 'RESERVE') THEN l.qty_delta
           ELSE 0 END) as on_hand,
  SUM(CASE WHEN l.transaction_type = 'RESERVE' THEN ABS(l.qty_delta) ELSE 0 END) as reserved,
  SUM(CASE WHEN l.transaction_type IN ('RECEIPT', 'ADJUSTMENT_PLUS', 'RETURN', 'RELEASE') THEN l.qty_delta
           WHEN l.transaction_type IN ('ADJUSTMENT_MINUS', 'SALE_DECREMENT', 'RESERVE') THEN l.qty_delta
           ELSE 0 END) - SUM(CASE WHEN l.transaction_type = 'RESERVE' THEN ABS(l.qty_delta) ELSE 0 END) as available
FROM public.inventory_ledger l
JOIN public.skus s ON s.id = l.sku_id
JOIN public.locations loc ON loc.id = l.location_id
GROUP BY l.client_id, l.sku_id, s.client_sku, s.title, s.fnsku, l.location_id, loc.name;

-- RLS Policies for locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view locations" ON public.locations
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage locations" ON public.locations
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for skus
ALTER TABLE public.skus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all SKUs" ON public.skus
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own SKUs" ON public.skus
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.clients WHERE clients.id = skus.client_id AND clients.user_id = auth.uid())
  );

CREATE POLICY "Clients can insert their own SKUs" ON public.skus
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.clients WHERE clients.id = skus.client_id AND clients.user_id = auth.uid())
  );

CREATE POLICY "Clients can update their own SKUs" ON public.skus
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.clients WHERE clients.id = skus.client_id AND clients.user_id = auth.uid())
  );

-- RLS Policies for sku_aliases
ALTER TABLE public.sku_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all SKU aliases" ON public.sku_aliases
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own SKU aliases" ON public.sku_aliases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.skus 
      JOIN public.clients ON clients.id = skus.client_id 
      WHERE skus.id = sku_aliases.sku_id AND clients.user_id = auth.uid()
    )
  );

-- RLS Policies for asn_headers
ALTER TABLE public.asn_headers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all ASNs" ON public.asn_headers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own ASNs" ON public.asn_headers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.clients WHERE clients.id = asn_headers.client_id AND clients.user_id = auth.uid())
  );

CREATE POLICY "Clients can create their own ASNs" ON public.asn_headers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.clients WHERE clients.id = asn_headers.client_id AND clients.user_id = auth.uid())
  );

CREATE POLICY "Clients can update their draft ASNs" ON public.asn_headers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.clients WHERE clients.id = asn_headers.client_id AND clients.user_id = auth.uid())
    AND status = 'draft'
  );

-- RLS Policies for asn_lines
ALTER TABLE public.asn_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all ASN lines" ON public.asn_lines
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own ASN lines" ON public.asn_lines
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.asn_headers 
      JOIN public.clients ON clients.id = asn_headers.client_id 
      WHERE asn_headers.id = asn_lines.asn_id AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can insert lines on their draft ASNs" ON public.asn_lines
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.asn_headers 
      JOIN public.clients ON clients.id = asn_headers.client_id 
      WHERE asn_headers.id = asn_lines.asn_id 
      AND clients.user_id = auth.uid()
      AND asn_headers.status = 'draft'
    )
  );

-- RLS Policies for inventory_ledger
ALTER TABLE public.inventory_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all ledger entries" ON public.inventory_ledger
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own ledger entries" ON public.inventory_ledger
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.clients WHERE clients.id = inventory_ledger.client_id AND clients.user_id = auth.uid())
  );

-- RLS Policies for attachments
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all attachments" ON public.attachments
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view attachments for their ASNs" ON public.attachments
  FOR SELECT USING (
    owner_type = 'asn' AND EXISTS (
      SELECT 1 FROM public.asn_headers 
      JOIN public.clients ON clients.id = asn_headers.client_id 
      WHERE asn_headers.id = attachments.owner_id AND clients.user_id = auth.uid()
    )
  );

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.skus;
ALTER PUBLICATION supabase_realtime ADD TABLE public.asn_headers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.asn_lines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_ledger;