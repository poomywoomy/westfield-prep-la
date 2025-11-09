-- Step 1: Drop views that depend on fnsku
DROP VIEW IF EXISTS inventory_summary_complete CASCADE;
DROP VIEW IF EXISTS inventory_summary CASCADE;

-- Step 2: Add internal_sku column (nullable first to allow data migration)
ALTER TABLE skus 
ADD COLUMN internal_sku TEXT;

-- Step 3: Copy client_sku to internal_sku for all existing records
UPDATE skus 
SET internal_sku = client_sku 
WHERE internal_sku IS NULL;

-- Step 4: Make internal_sku mandatory
ALTER TABLE skus 
ALTER COLUMN internal_sku SET NOT NULL;

-- Step 5: Add unique constraint per client
CREATE UNIQUE INDEX idx_skus_internal_sku_client 
ON skus(client_id, internal_sku);

-- Step 6: Remove fnsku column
ALTER TABLE skus 
DROP COLUMN IF EXISTS fnsku;

-- Step 7: Add comment
COMMENT ON COLUMN skus.internal_sku IS 'Internal SKU identifier used for warehouse operations';

-- Step 8: Recreate inventory_summary view without fnsku (using correct enum values)
CREATE VIEW inventory_summary AS
SELECT 
  s.id AS sku_id,
  s.client_id,
  s.internal_sku,
  s.client_sku,
  l.location_id,
  COALESCE(SUM(l.qty_delta) FILTER (WHERE l.transaction_type NOT IN ('RESERVE', 'RELEASE')), 0) AS on_hand,
  COALESCE(SUM(l.qty_delta) FILTER (WHERE l.transaction_type = 'RESERVE'), 0) AS reserved,
  COALESCE(SUM(l.qty_delta), 0) AS available
FROM skus s
LEFT JOIN inventory_ledger l ON s.id = l.sku_id
WHERE s.status = 'active'
GROUP BY s.id, s.client_id, s.internal_sku, s.client_sku, l.location_id;

-- Step 9: Recreate inventory_summary_complete view with internal_sku
CREATE VIEW inventory_summary_complete AS
SELECT 
  s.id AS sku_id,
  s.client_id,
  s.internal_sku,
  s.client_sku,
  s.title,
  s.image_url,
  isummary.location_id,
  loc.name AS location_name,
  COALESCE(isummary.on_hand, 0) AS on_hand,
  COALESCE(isummary.reserved, 0) AS reserved,
  COALESCE(isummary.available, 0) AS available
FROM skus s
LEFT JOIN inventory_summary isummary ON s.id = isummary.sku_id
LEFT JOIN locations loc ON isummary.location_id = loc.id
WHERE s.status = 'active';

-- Step 10: Create package templates table
CREATE TABLE sku_package_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sku_combination JSONB NOT NULL,
  package_type TEXT NOT NULL DEFAULT 'box',
  length_in NUMERIC(10,2) NOT NULL,
  width_in NUMERIC(10,2) NOT NULL,
  height_in NUMERIC(10,2) NOT NULL,
  weight_lbs NUMERIC(10,2) NOT NULL,
  use_count INTEGER DEFAULT 1 NOT NULL,
  last_used_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  notes TEXT,
  CONSTRAINT sku_package_templates_unique_combo 
    UNIQUE (client_id, sku_combination)
);

-- Indexes for performance
CREATE INDEX idx_package_templates_client 
  ON sku_package_templates(client_id);
  
CREATE INDEX idx_package_templates_combo 
  ON sku_package_templates USING gin(sku_combination);

CREATE INDEX idx_package_templates_last_used 
  ON sku_package_templates(last_used_at DESC);

-- Comments
COMMENT ON TABLE sku_package_templates IS 
  'Stores package dimensions for SKU combinations to avoid re-entering data for repeat orders';
  
COMMENT ON COLUMN sku_package_templates.sku_combination IS 
  'Sorted JSONB array of {sku_id, quantity} pairs representing items in this package';
  
COMMENT ON COLUMN sku_package_templates.use_count IS 
  'Number of times this template has been used for fulfillment';

-- RLS Policies
ALTER TABLE sku_package_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all package templates"
  ON sku_package_templates
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own package templates"
  ON sku_package_templates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = sku_package_templates.client_id
      AND clients.user_id = auth.uid()
    )
  );