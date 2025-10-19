-- ============================================================================
-- COMPLETE BILLING & QUOTES OVERHAUL
-- ============================================================================

-- Phase 1: Remove QC Images
DROP TABLE IF EXISTS public.qc_images CASCADE;
DROP FUNCTION IF EXISTS public.delete_expired_qc_images() CASCADE;

-- Phase 2: Update Clients
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS deposit_balance_cents INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Los_Angeles',
ADD COLUMN IF NOT EXISTS billing_emails TEXT[] DEFAULT '{}';

-- Phase 3: Update Quotes (handle policies and defaults properly)
DO $$ 
DECLARE policy_rec record;
BEGIN
  FOR policy_rec IN 
    SELECT policyname FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'quote_lines'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || policy_rec.policyname || '" ON public.quote_lines';
  END LOOP;
END $$;

-- Create enum type
DO $$ BEGIN
  CREATE TYPE quote_status AS ENUM ('draft', 'active', 'replaced', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Convert status column
ALTER TABLE public.quotes ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.quotes ALTER COLUMN status TYPE TEXT;
UPDATE public.quotes SET status = CASE 
  WHEN status = 'pending' THEN 'draft'
  WHEN status = 'approved' THEN 'active'
  ELSE 'draft'
END;
ALTER TABLE public.quotes ALTER COLUMN status TYPE quote_status USING status::quote_status;
ALTER TABLE public.quotes ALTER COLUMN status SET DEFAULT 'draft'::quote_status;

-- Add new columns
ALTER TABLE public.quotes
ADD COLUMN IF NOT EXISTS activated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS memo TEXT;

-- Unique index for one active quote per client
DROP INDEX IF EXISTS idx_quotes_client_active;
CREATE UNIQUE INDEX idx_quotes_client_active ON public.quotes(client_id) WHERE status = 'active';

-- Recreate quote_lines policies
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quote_lines') THEN
    EXECUTE 'CREATE POLICY "Admins can manage all quote lines" ON public.quote_lines FOR ALL USING (has_role(auth.uid(), ''admin''::app_role)) WITH CHECK (has_role(auth.uid(), ''admin''::app_role))';
    EXECUTE 'CREATE POLICY "Clients can view quote lines on their quotes" ON public.quote_lines FOR SELECT USING (EXISTS (SELECT 1 FROM public.quotes JOIN public.clients ON clients.id = quotes.client_id WHERE quotes.id = quote_lines.quote_id AND clients.user_id = auth.uid()))';
  END IF;
END $$;

-- Phase 4: Create Bills Tables
CREATE TABLE IF NOT EXISTS public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  billing_month DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'sent', 'paid', 'partially_paid', 'overdue', 'canceled')),
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  discount_cents INTEGER NOT NULL DEFAULT 0,
  amount_due_cents INTEGER NOT NULL DEFAULT 0,
  pdf_url TEXT,
  emailed_at TIMESTAMP WITH TIME ZONE,
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(client_id, billing_month)
);

CREATE INDEX IF NOT EXISTS idx_bills_client_month ON public.bills(client_id, billing_month);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);

CREATE TABLE IF NOT EXISTS public.bill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  service_code TEXT,
  service_name TEXT NOT NULL,
  qty_decimal NUMERIC(12,4) NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  discount_cents INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'storage', 'late_fee', 'receiving', 'other')),
  sku_ref TEXT,
  note TEXT,
  line_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bill_items_bill ON public.bill_items(bill_id);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  bill_id UUID REFERENCES public.bills(id) ON DELETE SET NULL,
  method TEXT NOT NULL CHECK (method IN ('deposit', 'card', 'ach', 'wire', 'check', 'manual')),
  amount_cents INTEGER NOT NULL,
  external_ref TEXT,
  received_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_client ON public.payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_bill ON public.payments(bill_id);

CREATE TABLE IF NOT EXISTS public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  bill_id UUID REFERENCES public.bills(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('return', 'damage', 'goodwill', 'pricing_error', 'other')),
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_credits_client ON public.credits(client_id);

-- Phase 5: Enable RLS and Policies
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all bills" ON public.bills;
CREATE POLICY "Admins can manage all bills" ON public.bills FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Clients can view their own bills" ON public.bills;
CREATE POLICY "Clients can view their own bills" ON public.bills FOR SELECT USING (EXISTS (SELECT 1 FROM public.clients WHERE clients.id = bills.client_id AND clients.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all bill items" ON public.bill_items;
CREATE POLICY "Admins can manage all bill items" ON public.bill_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Clients can view their own bill items" ON public.bill_items;
CREATE POLICY "Clients can view their own bill items" ON public.bill_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.bills JOIN public.clients ON clients.id = bills.client_id WHERE bills.id = bill_items.bill_id AND clients.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
CREATE POLICY "Admins can manage all payments" ON public.payments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Clients can view their own payments" ON public.payments;
CREATE POLICY "Clients can view their own payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.clients WHERE clients.id = payments.client_id AND clients.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all credits" ON public.credits;
CREATE POLICY "Admins can manage all credits" ON public.credits FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Clients can view their own credits" ON public.credits;
CREATE POLICY "Clients can view their own credits" ON public.credits FOR SELECT USING (EXISTS (SELECT 1 FROM public.clients WHERE clients.id = credits.client_id AND clients.user_id = auth.uid()));

-- Phase 6: Triggers & Realtime
DROP TRIGGER IF EXISTS update_bills_updated_at ON public.bills;
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON public.bills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_bill_items_updated_at ON public.bill_items;
CREATE TRIGGER update_bill_items_updated_at BEFORE UPDATE ON public.bill_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.bills;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bill_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credits;