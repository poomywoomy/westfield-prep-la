-- Create shopify_returns table for tracking returns from Shopify
CREATE TABLE shopify_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  shopify_return_id TEXT NOT NULL,
  shopify_order_id TEXT,
  order_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('requested', 'approved', 'declined', 'received', 'processing', 'completed')),
  return_reason TEXT,
  line_items JSONB NOT NULL DEFAULT '[]',
  expected_qty INTEGER DEFAULT 0,
  processed_qty INTEGER DEFAULT 0,
  created_at_shopify TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, shopify_return_id)
);

-- Enable RLS
ALTER TABLE shopify_returns ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage all returns"
  ON shopify_returns FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own returns"
  ON shopify_returns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = shopify_returns.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Add performance indexes
CREATE INDEX idx_shopify_returns_client_status ON shopify_returns(client_id, status);
CREATE INDEX idx_shopify_returns_shopify_return_id ON shopify_returns(shopify_return_id);
CREATE INDEX idx_inventory_ledger_transaction_type_ts ON inventory_ledger(transaction_type, ts DESC);
CREATE INDEX idx_damaged_decisions_source_status ON damaged_item_decisions(source_type, status, client_id);