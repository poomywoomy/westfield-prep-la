-- Create line_status enum for quote lines
CREATE TYPE line_status AS ENUM ('awaiting', 'in_progress', 'ready', 'shipped');

-- Add soft delete fields to billing_payments
ALTER TABLE billing_payments
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN deleted_by UUID REFERENCES auth.users(id);

-- Create payment_events table for audit trail
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES billing_payments(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('create', 'delete', 'restore')),
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL,
  note TEXT,
  actor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_lines table for SKU-level quote management
CREATE TABLE quote_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  product_name TEXT,
  service_type TEXT NOT NULL,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  qty_estimated INTEGER NOT NULL DEFAULT 0,
  qty_actual INTEGER NOT NULL DEFAULT 0,
  line_total NUMERIC NOT NULL DEFAULT 0,
  line_status line_status NOT NULL DEFAULT 'awaiting',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add quote_line_id to invoice_items
ALTER TABLE invoice_items
ADD COLUMN quote_line_id UUID REFERENCES quote_lines(id);

-- Create price_changes audit table
CREATE TABLE price_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_line_id UUID NOT NULL REFERENCES quote_lines(id) ON DELETE CASCADE,
  old_price NUMERIC NOT NULL,
  new_price NUMERIC NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create receivings table
CREATE TABLE receivings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id),
  shipment_ref TEXT NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  received_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create receiving_items table
CREATE TABLE receiving_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receiving_id UUID NOT NULL REFERENCES receivings(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  expected_qty INTEGER NOT NULL DEFAULT 0,
  received_qty INTEGER NOT NULL DEFAULT 0,
  damaged_qty INTEGER NOT NULL DEFAULT 0,
  missing_qty INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE receivings ENABLE ROW LEVEL SECURITY;
ALTER TABLE receiving_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_events
CREATE POLICY "Admins can manage all payment events"
  ON payment_events FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their payment events"
  ON payment_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM billing_payments bp
    JOIN clients c ON c.id = bp.client_id
    WHERE bp.id = payment_events.payment_id
    AND c.user_id = auth.uid()
  ));

-- RLS policies for quote_lines
CREATE POLICY "Admins can manage all quote lines"
  ON quote_lines FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their quote lines"
  ON quote_lines FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quotes q
    JOIN clients c ON c.id = q.client_id
    WHERE q.id = quote_lines.quote_id
    AND c.user_id = auth.uid()
  ));

CREATE POLICY "Clients can insert quote lines on their quotes"
  ON quote_lines FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM quotes q
    JOIN clients c ON c.id = q.client_id
    WHERE q.id = quote_lines.quote_id
    AND c.user_id = auth.uid()
    AND q.status IN ('pending', 'active')
  ));

CREATE POLICY "Clients can update their quote lines"
  ON quote_lines FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM quotes q
    JOIN clients c ON c.id = q.client_id
    WHERE q.id = quote_lines.quote_id
    AND c.user_id = auth.uid()
    AND q.status IN ('pending', 'active')
  ));

-- RLS policies for price_changes
CREATE POLICY "Admins can manage all price changes"
  ON price_changes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view price changes on their quotes"
  ON price_changes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quote_lines ql
    JOIN quotes q ON q.id = ql.quote_id
    JOIN clients c ON c.id = q.client_id
    WHERE ql.id = price_changes.quote_line_id
    AND c.user_id = auth.uid()
  ));

-- RLS policies for receivings
CREATE POLICY "Admins can manage all receivings"
  ON receivings FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their receivings"
  ON receivings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = receivings.client_id
    AND c.user_id = auth.uid()
  ));

-- RLS policies for receiving_items
CREATE POLICY "Admins can manage all receiving items"
  ON receiving_items FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their receiving items"
  ON receiving_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM receivings r
    JOIN clients c ON c.id = r.client_id
    WHERE r.id = receiving_items.receiving_id
    AND c.user_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX idx_payment_events_payment_id ON payment_events(payment_id);
CREATE INDEX idx_quote_lines_quote_id ON quote_lines(quote_id);
CREATE INDEX idx_quote_lines_sku ON quote_lines(sku);
CREATE INDEX idx_price_changes_quote_line_id ON price_changes(quote_line_id);
CREATE INDEX idx_receivings_client_id ON receivings(client_id);
CREATE INDEX idx_receivings_quote_id ON receivings(quote_id);
CREATE INDEX idx_receiving_items_receiving_id ON receiving_items(receiving_id);
CREATE INDEX idx_receiving_items_sku ON receiving_items(sku);
CREATE INDEX idx_billing_payments_deleted_at ON billing_payments(deleted_at) WHERE deleted_at IS NULL;

-- Create trigger for quote_lines updated_at
CREATE TRIGGER update_quote_lines_updated_at
  BEFORE UPDATE ON quote_lines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to recalculate quote line total
CREATE OR REPLACE FUNCTION recalculate_quote_line_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.line_total = NEW.unit_price * NEW.qty_actual;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_line_total_trigger
  BEFORE INSERT OR UPDATE ON quote_lines
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_quote_line_total();