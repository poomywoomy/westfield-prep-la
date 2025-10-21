-- Phase 1: Barcode System Foundation (Corrected)
-- Creates tables for shipment templates and barcode audit trail

-- ============================================================================
-- 1. SHIPMENT TEMPLATES (Recurring shipment configurations)
-- ============================================================================

CREATE TABLE public.shipment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  carrier TEXT,
  ship_from TEXT,
  notes TEXT,
  use_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_template_per_client UNIQUE (client_id, template_name)
);

CREATE INDEX idx_shipment_templates_client_id ON public.shipment_templates(client_id);
CREATE INDEX idx_shipment_templates_last_used ON public.shipment_templates(last_used_at DESC);

COMMENT ON TABLE public.shipment_templates IS 'Reusable shipment configurations for recurring ASNs';
COMMENT ON COLUMN public.shipment_templates.use_count IS 'Number of times this template has been used';

-- ============================================================================
-- 2. SHIPMENT TEMPLATE LINES (SKU line items for templates)
-- ============================================================================

CREATE TABLE public.shipment_template_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.shipment_templates(id) ON DELETE CASCADE,
  sku_id UUID NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  expected_units INTEGER NOT NULL CHECK (expected_units > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_template_lines_template_id ON public.shipment_template_lines(template_id);
CREATE INDEX idx_template_lines_sku_id ON public.shipment_template_lines(sku_id);

COMMENT ON TABLE public.shipment_template_lines IS 'Line items (SKUs and quantities) for shipment templates';

-- ============================================================================
-- 3. BARCODE SCANS (Complete audit trail)
-- ============================================================================

CREATE TABLE public.barcode_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES public.clients(id),
  barcode_value TEXT NOT NULL,
  detected_type TEXT NOT NULL, -- 'tracking', 'product_upc', 'product_ean', 'location', 'unknown'
  matched_table TEXT, -- 'asn_headers', 'skus', 'locations', null if not found
  matched_id UUID, -- ID of matched record
  scan_result TEXT NOT NULL, -- 'found', 'not_found', 'error'
  context_type TEXT, -- 'receiving', 'adjustment', 'lookup', 'asn_creation'
  context_id UUID, -- ID of ASN, adjustment, etc.
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Optional metadata
  device_type TEXT, -- 'camera', 'usb_scanner', 'bluetooth_scanner', 'manual'
  scan_duration_ms INTEGER
);

CREATE INDEX idx_barcode_scans_user_id ON public.barcode_scans(user_id);
CREATE INDEX idx_barcode_scans_client_id ON public.barcode_scans(client_id);
CREATE INDEX idx_barcode_scans_scanned_at ON public.barcode_scans(scanned_at DESC);
CREATE INDEX idx_barcode_scans_barcode_value ON public.barcode_scans(barcode_value);

COMMENT ON TABLE public.barcode_scans IS 'Complete audit trail of all barcode scans in the system';
COMMENT ON COLUMN public.barcode_scans.detected_type IS 'Type of barcode detected by scanner';
COMMENT ON COLUMN public.barcode_scans.scan_result IS 'Whether the scan found a match in the database';

-- ============================================================================
-- 4. ENHANCE EXISTING TABLES
-- ============================================================================

-- Add template reference to ASN headers
ALTER TABLE public.asn_headers 
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.shipment_templates(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_asn_headers_template_id ON public.asn_headers(template_id);

COMMENT ON COLUMN public.asn_headers.template_id IS 'Optional reference to the template used to create this ASN';

-- ============================================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.shipment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_template_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barcode_scans ENABLE ROW LEVEL SECURITY;

-- Shipment Templates: Admins full access, clients manage their own
CREATE POLICY "Admins can manage all templates"
  ON public.shipment_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can manage their own templates"
  ON public.shipment_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = shipment_templates.client_id
        AND clients.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = shipment_templates.client_id
        AND clients.user_id = auth.uid()
    )
  );

-- Template Lines: Inherit access from parent template
CREATE POLICY "Admins can manage all template lines"
  ON public.shipment_template_lines FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage template lines for their templates"
  ON public.shipment_template_lines FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.shipment_templates st
      LEFT JOIN public.clients c ON c.id = st.client_id
      WHERE st.id = shipment_template_lines.template_id
        AND (has_role(auth.uid(), 'admin'::app_role) OR c.user_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shipment_templates st
      LEFT JOIN public.clients c ON c.id = st.client_id
      WHERE st.id = shipment_template_lines.template_id
        AND (has_role(auth.uid(), 'admin'::app_role) OR c.user_id = auth.uid())
    )
  );

-- Barcode Scans: Admins view all, users view their own, service role can insert
CREATE POLICY "Admins can view all barcode scans"
  ON public.barcode_scans FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own barcode scans"
  ON public.barcode_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert barcode scans"
  ON public.barcode_scans FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- 6. TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp for shipment_templates
CREATE TRIGGER update_shipment_templates_updated_at
  BEFORE UPDATE ON public.shipment_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 7. GRANTS (Service role needs access for edge functions)
-- ============================================================================

GRANT ALL ON public.shipment_templates TO service_role;
GRANT ALL ON public.shipment_template_lines TO service_role;
GRANT ALL ON public.barcode_scans TO service_role;