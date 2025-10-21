-- Update validation trigger to allow users to activate their own pending accounts
-- and allow system/migration scripts to perform backfills
CREATE OR REPLACE FUNCTION public.validate_client_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  -- Prevent modification of other admin-only fields for non-admin users
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

-- Create secure RPC to activate client on login
CREATE OR REPLACE FUNCTION public.activate_client_on_login()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.clients
  SET status = 'active'
  WHERE user_id = auth.uid()
    AND status = 'pending';
END;
$$;

-- One-time backfill: activate all past clients who have already logged in
UPDATE public.clients c
SET status = 'active'
FROM auth.users u
WHERE c.user_id = u.id
  AND c.status = 'pending'
  AND u.last_sign_in_at IS NOT NULL;