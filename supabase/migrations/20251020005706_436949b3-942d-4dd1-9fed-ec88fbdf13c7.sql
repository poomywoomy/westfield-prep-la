-- Add ASN Number and attachments support
ALTER TABLE asn_headers 
ADD COLUMN IF NOT EXISTS asn_number TEXT UNIQUE;

-- Backfill existing ASNs with legacy numbers
UPDATE asn_headers 
SET asn_number = 'LEGACY-' || id::text 
WHERE asn_number IS NULL;

-- Make asn_number NOT NULL after backfill
ALTER TABLE asn_headers 
ALTER COLUMN asn_number SET NOT NULL;

-- Create asn_attachments table
CREATE TABLE IF NOT EXISTS asn_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asn_id UUID NOT NULL REFERENCES asn_headers(id) ON DELETE CASCADE,
  asn_line_id UUID REFERENCES asn_lines(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies for asn_attachments
ALTER TABLE asn_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all ASN attachments"
ON asn_attachments FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own ASN attachments"
ON asn_attachments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM asn_headers
    JOIN clients ON clients.id = asn_headers.client_id
    WHERE asn_headers.id = asn_attachments.asn_id
    AND clients.user_id = auth.uid()
  )
);

CREATE POLICY "Clients can add attachments to their draft ASNs"
ON asn_attachments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM asn_headers
    JOIN clients ON clients.id = asn_headers.client_id
    WHERE asn_headers.id = asn_attachments.asn_id
    AND clients.user_id = auth.uid()
    AND asn_headers.status = 'draft'
  )
);

-- Add billing enhancements
ALTER TABLE bills 
ADD COLUMN IF NOT EXISTS label TEXT,
ADD COLUMN IF NOT EXISTS pricing_quote_id UUID REFERENCES quotes(id);

-- Add index for asn_number lookups
CREATE INDEX IF NOT EXISTS idx_asn_headers_asn_number ON asn_headers(asn_number);

-- Add index for asn_attachments
CREATE INDEX IF NOT EXISTS idx_asn_attachments_asn_id ON asn_attachments(asn_id);
CREATE INDEX IF NOT EXISTS idx_asn_attachments_asn_line_id ON asn_attachments(asn_line_id);

-- Create function to generate ASN number
CREATE OR REPLACE FUNCTION generate_asn_number(p_client_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_code TEXT;
  v_year_month TEXT;
  v_sequence INT;
  v_asn_number TEXT;
BEGIN
  -- Get client code (first 3 letters of company name, uppercase)
  SELECT UPPER(LEFT(REGEXP_REPLACE(company_name, '[^A-Za-z]', '', 'g'), 3))
  INTO v_client_code
  FROM clients
  WHERE id = p_client_id;
  
  -- Get current year-month
  v_year_month := TO_CHAR(NOW(), 'YYYYMM');
  
  -- Get next sequence number for this client and month
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(asn_number FROM '.*-(\d+)$') AS INTEGER
    )
  ), 0) + 1
  INTO v_sequence
  FROM asn_headers
  WHERE client_id = p_client_id
  AND asn_number LIKE v_client_code || '-' || v_year_month || '-%';
  
  -- Format: ABC-202510-001
  v_asn_number := v_client_code || '-' || v_year_month || '-' || LPAD(v_sequence::TEXT, 3, '0');
  
  RETURN v_asn_number;
END;
$$;