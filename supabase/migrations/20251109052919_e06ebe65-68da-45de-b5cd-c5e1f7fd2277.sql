-- Create enums for shipment system
CREATE TYPE shipment_split_type AS ENUM ('amazon_optimized', 'minimal_split');
CREATE TYPE shipment_status AS ENUM ('draft', 'shipped');
CREATE TYPE destination_type AS ENUM ('amazon_fba', 'walmart_wfs', 'tiktok_shop');

-- Create outbound_shipments table
CREATE TABLE public.outbound_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  shipment_number TEXT NOT NULL UNIQUE,
  shipment_split_type shipment_split_type NOT NULL DEFAULT 'amazon_optimized',
  destination_type destination_type NOT NULL DEFAULT 'amazon_fba',
  shipment_status shipment_status NOT NULL DEFAULT 'draft',
  ship_from_address TEXT NOT NULL DEFAULT '1801 Flower Ave Office 2, Duarte, CA 91010',
  total_units INTEGER NOT NULL DEFAULT 0,
  total_boxes INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  shipped_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_outbound_shipments_client ON public.outbound_shipments(client_id);
CREATE INDEX idx_outbound_shipments_status ON public.outbound_shipments(shipment_status);
CREATE INDEX idx_outbound_shipments_created ON public.outbound_shipments(created_at DESC);

-- Create outbound_shipment_boxes table
CREATE TABLE public.outbound_shipment_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.outbound_shipments(id) ON DELETE CASCADE,
  box_number INTEGER NOT NULL,
  weight_lbs NUMERIC(10,2),
  length_in NUMERIC(10,2),
  width_in NUMERIC(10,2),
  height_in NUMERIC(10,2),
  tracking_number TEXT,
  carrier TEXT,
  fba_shipment_id TEXT,
  fba_destination_fc TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shipment_id, box_number)
);

CREATE INDEX idx_outbound_boxes_shipment ON public.outbound_shipment_boxes(shipment_id);

-- Create outbound_shipment_lines table
CREATE TABLE public.outbound_shipment_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.outbound_shipments(id) ON DELETE CASCADE,
  box_id UUID REFERENCES public.outbound_shipment_boxes(id) ON DELETE CASCADE,
  sku_id UUID NOT NULL REFERENCES public.skus(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shipment_id, box_id, sku_id)
);

CREATE INDEX idx_outbound_lines_shipment ON public.outbound_shipment_lines(shipment_id);
CREATE INDEX idx_outbound_lines_sku ON public.outbound_shipment_lines(sku_id);

-- Create shipment number generator function
CREATE OR REPLACE FUNCTION public.generate_shipment_number(p_client_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_client_code TEXT;
  v_year_month TEXT;
  v_sequence INT;
  v_shipment_number TEXT;
BEGIN
  -- Get client code (first 3 letters, uppercase)
  SELECT UPPER(LEFT(REGEXP_REPLACE(company_name, '[^A-Za-z]', '', 'g'), 3))
  INTO v_client_code
  FROM public.clients
  WHERE id = p_client_id;
  
  -- Get current year-month
  v_year_month := TO_CHAR(NOW(), 'YYYYMM');
  
  -- Get next sequence for this client and month
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(shipment_number FROM '.*-(\d+)$') AS INTEGER)
  ), 0) + 1
  INTO v_sequence
  FROM public.outbound_shipments
  WHERE client_id = p_client_id
  AND shipment_number LIKE v_client_code || '-SHP-' || v_year_month || '-%';
  
  -- Format: ABC-SHP-202501-001
  v_shipment_number := v_client_code || '-SHP-' || v_year_month || '-' || LPAD(v_sequence::TEXT, 3, '0');
  
  RETURN v_shipment_number;
END;
$$;

-- Enable RLS on all tables
ALTER TABLE public.outbound_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbound_shipment_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbound_shipment_lines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for outbound_shipments
CREATE POLICY "Admins can manage all shipments" 
ON public.outbound_shipments 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their shipped shipments" 
ON public.outbound_shipments 
FOR SELECT 
TO authenticated 
USING (
  shipment_status = 'shipped' AND EXISTS (
    SELECT 1 FROM public.clients WHERE clients.id = outbound_shipments.client_id AND clients.user_id = auth.uid()
  )
);

-- RLS Policies for outbound_shipment_boxes
CREATE POLICY "Admins can manage all boxes" 
ON public.outbound_shipment_boxes 
FOR ALL 
TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.outbound_shipments WHERE id = outbound_shipment_boxes.shipment_id AND has_role(auth.uid(), 'admin'::app_role))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.outbound_shipments WHERE id = outbound_shipment_boxes.shipment_id AND has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Clients can view boxes for their shipped shipments" 
ON public.outbound_shipment_boxes 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.outbound_shipments os 
    JOIN public.clients c ON c.id = os.client_id 
    WHERE os.id = outbound_shipment_boxes.shipment_id 
    AND os.shipment_status = 'shipped' 
    AND c.user_id = auth.uid()
  )
);

-- RLS Policies for outbound_shipment_lines
CREATE POLICY "Admins can manage all lines" 
ON public.outbound_shipment_lines 
FOR ALL 
TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.outbound_shipments WHERE id = outbound_shipment_lines.shipment_id AND has_role(auth.uid(), 'admin'::app_role))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.outbound_shipments WHERE id = outbound_shipment_lines.shipment_id AND has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Clients can view lines for their shipped shipments" 
ON public.outbound_shipment_lines 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.outbound_shipments os 
    JOIN public.clients c ON c.id = os.client_id 
    WHERE os.id = outbound_shipment_lines.shipment_id 
    AND os.shipment_status = 'shipped' 
    AND c.user_id = auth.uid()
  )
);

-- Create updated_at trigger
CREATE TRIGGER update_outbound_shipments_updated_at
  BEFORE UPDATE ON public.outbound_shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();