-- Comprehensive Security Enhancements

-- 1. Add indexes for better query performance and security
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_charges_client_id ON public.billing_charges(client_id);
CREATE INDEX IF NOT EXISTS idx_billing_charges_billing_month ON public.billing_charges(billing_month);
CREATE INDEX IF NOT EXISTS idx_custom_pricing_client_id ON public.custom_pricing(client_id);
CREATE INDEX IF NOT EXISTS idx_qc_images_client_id ON public.qc_images(client_id);
CREATE INDEX IF NOT EXISTS idx_qc_images_expires_at ON public.qc_images(expires_at);

-- 2. Add check constraints for data validation
ALTER TABLE public.clients
ADD CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.clients
ADD CONSTRAINT check_phone_not_empty CHECK (phone_number IS NOT NULL AND length(trim(phone_number)) > 0);

ALTER TABLE public.billing_charges
ADD CONSTRAINT check_positive_quantity CHECK (quantity > 0);

ALTER TABLE public.billing_charges
ADD CONSTRAINT check_positive_unit_price CHECK (unit_price >= 0);

ALTER TABLE public.billing_charges
ADD CONSTRAINT check_positive_total_amount CHECK (total_amount >= 0);

ALTER TABLE public.custom_pricing
ADD CONSTRAINT check_positive_price_per_unit CHECK (price_per_unit IS NULL OR price_per_unit >= 0);

-- 3. Ensure updated_at triggers exist for all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_clients_updated_at') THEN
    CREATE TRIGGER update_clients_updated_at
      BEFORE UPDATE ON public.clients
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_custom_pricing_updated_at') THEN
    CREATE TRIGGER update_custom_pricing_updated_at
      BEFORE UPDATE ON public.custom_pricing
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_quotes_updated_at') THEN
    CREATE TRIGGER update_quotes_updated_at
      BEFORE UPDATE ON public.quotes
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 4. Add audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON public.audit_log(table_name);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view all audit logs"
ON public.audit_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
END;
$$;

-- Add audit triggers to sensitive tables
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'audit_clients') THEN
    CREATE TRIGGER audit_clients
      AFTER INSERT OR UPDATE OR DELETE ON public.clients
      FOR EACH ROW
      EXECUTE FUNCTION public.audit_trigger();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'audit_billing_charges') THEN
    CREATE TRIGGER audit_billing_charges
      AFTER INSERT OR UPDATE OR DELETE ON public.billing_charges
      FOR EACH ROW
      EXECUTE FUNCTION public.audit_trigger();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'audit_custom_pricing') THEN
    CREATE TRIGGER audit_custom_pricing
      AFTER INSERT OR UPDATE OR DELETE ON public.custom_pricing
      FOR EACH ROW
      EXECUTE FUNCTION public.audit_trigger();
  END IF;
END $$;