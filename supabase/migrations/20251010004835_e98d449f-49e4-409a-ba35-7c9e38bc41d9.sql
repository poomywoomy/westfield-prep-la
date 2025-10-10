-- Update the validate_client_update trigger function to allow admins to bypass restrictions
CREATE OR REPLACE FUNCTION public.validate_client_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Allow admins to update any field without restrictions
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- Only allow updates if the user is updating their own record
  IF auth.uid() != NEW.user_id THEN
    RAISE EXCEPTION 'Unauthorized update attempt';
  END IF;

  -- Prevent modification of admin-only fields for non-admin users
  IF OLD.admin_notes IS DISTINCT FROM NEW.admin_notes THEN
    RAISE EXCEPTION 'Cannot modify admin_notes';
  END IF;
  
  IF OLD.pricing_active IS DISTINCT FROM NEW.pricing_active THEN
    RAISE EXCEPTION 'Cannot modify pricing_active';
  END IF;
  
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    RAISE EXCEPTION 'Cannot modify status';
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
$function$;