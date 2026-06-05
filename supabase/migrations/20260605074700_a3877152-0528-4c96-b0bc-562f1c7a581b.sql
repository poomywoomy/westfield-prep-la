-- 1. Shopify access_token: hide from client/admin authenticated reads (column-level privileges).
--    Edge functions use the service role and are unaffected.
REVOKE SELECT ON public.shopify_stores FROM authenticated;
GRANT SELECT (id, client_id, shop_domain, scope, connected_at, updated_at, is_active)
  ON public.shopify_stores TO authenticated;

-- 2. Clients table: add WITH CHECK to the self-update policy and strengthen the
--    validation trigger to block additional sensitive financial fields.
DROP POLICY IF EXISTS "Clients can update their own profile" ON public.clients;
CREATE POLICY "Clients can update their own profile"
ON public.clients FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.validate_client_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Allow system operations (migrations, backfills)
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Allow admins to update any field without restrictions
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- Only allow updates if the user is updating their own record
  IF auth.uid() != NEW.user_id THEN
    RAISE EXCEPTION 'Unauthorized update attempt';
  END IF;

  -- Allow users to activate their own pending account (pending -> active only)
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF OLD.status = 'pending' AND NEW.status = 'active' AND auth.uid() = NEW.user_id THEN
      -- Allow this specific transition
    ELSE
      RAISE EXCEPTION 'Cannot modify status';
    END IF;
  END IF;

  -- Prevent modification of admin-only / financial fields for non-admin users
  IF OLD.admin_notes IS DISTINCT FROM NEW.admin_notes THEN
    RAISE EXCEPTION 'Cannot modify admin_notes';
  END IF;

  IF OLD.pricing_active IS DISTINCT FROM NEW.pricing_active THEN
    RAISE EXCEPTION 'Cannot modify pricing_active';
  END IF;

  IF OLD.billing_frequency IS DISTINCT FROM NEW.billing_frequency THEN
    RAISE EXCEPTION 'Cannot modify billing_frequency';
  END IF;

  IF OLD.password_expires_at IS DISTINCT FROM NEW.password_expires_at THEN
    RAISE EXCEPTION 'Cannot modify password_expires_at';
  END IF;

  IF OLD.deposit_balance_cents IS DISTINCT FROM NEW.deposit_balance_cents THEN
    RAISE EXCEPTION 'Cannot modify deposit_balance_cents';
  END IF;

  IF OLD.fulfillment_services IS DISTINCT FROM NEW.fulfillment_services THEN
    RAISE EXCEPTION 'Cannot modify fulfillment_services';
  END IF;

  IF OLD.temp_password IS DISTINCT FROM NEW.temp_password THEN
    RAISE EXCEPTION 'Cannot modify temp_password';
  END IF;

  -- Prevent modification of system fields
  IF OLD.user_id != NEW.user_id THEN
    RAISE EXCEPTION 'Cannot modify user_id';
  END IF;

  IF OLD.id != NEW.id THEN
    RAISE EXCEPTION 'Cannot modify id';
  END IF;

  IF OLD.created_at != NEW.created_at THEN
    RAISE EXCEPTION 'Cannot modify created_at';
  END IF;

  RETURN NEW;
END;
$$;

-- 3. prep_center_config: restrict reads to admins only (admin "manage" policy already
--    grants admin access; remove the blanket authenticated read).
DROP POLICY IF EXISTS "Everyone can read prep center config" ON public.prep_center_config;