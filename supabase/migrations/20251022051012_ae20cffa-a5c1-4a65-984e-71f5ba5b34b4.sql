-- Create inventory discrepancies summary view
CREATE OR REPLACE VIEW inventory_discrepancies_summary AS
SELECT 
  ah.client_id,
  al.sku_id,
  s.client_sku,
  s.title,
  s.image_url,
  ah.asn_number,
  ah.id as asn_id,
  SUM(al.damaged_units) as damaged_qty,
  SUM(al.missing_units) as missing_qty,
  SUM(al.quarantined_units) as quarantined_qty,
  ah.received_at,
  ah.status,
  ah.created_at
FROM asn_lines al
JOIN asn_headers ah ON ah.id = al.asn_id
JOIN skus s ON s.id = al.sku_id
WHERE (al.damaged_units > 0 OR al.missing_units > 0 OR al.quarantined_units > 0)
  AND ah.status = 'issue'
GROUP BY ah.client_id, al.sku_id, s.client_sku, s.title, s.image_url, ah.asn_number, ah.id, ah.received_at, ah.status, ah.created_at;

-- Create damaged item decisions table
CREATE TABLE damaged_item_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  asn_id uuid NOT NULL REFERENCES asn_headers(id) ON DELETE CASCADE,
  sku_id uuid NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  discrepancy_type text NOT NULL CHECK (discrepancy_type IN ('damaged', 'missing', 'quarantined')),
  qc_photo_urls text[],
  decision text CHECK (decision IN ('discard', 'sell_as_bstock', 'return_to_sender', 'rework', 'acknowledge')),
  client_notes text,
  submitted_at timestamp with time zone,
  processed_at timestamp with time zone,
  processed_by uuid,
  admin_notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE damaged_item_decisions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for damaged_item_decisions
CREATE POLICY "Admins can manage all decisions"
ON damaged_item_decisions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own decisions"
ON damaged_item_decisions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = damaged_item_decisions.client_id
    AND clients.user_id = auth.uid()
  )
);

CREATE POLICY "Clients can insert their own decisions"
ON damaged_item_decisions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = damaged_item_decisions.client_id
    AND clients.user_id = auth.uid()
  )
);

CREATE POLICY "Clients can update their pending decisions"
ON damaged_item_decisions
FOR UPDATE
TO authenticated
USING (
  status = 'pending'
  AND EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = damaged_item_decisions.client_id
    AND clients.user_id = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_damaged_item_decisions_updated_at
BEFORE UPDATE ON damaged_item_decisions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();