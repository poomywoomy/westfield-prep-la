-- Drop existing overly permissive client policies
DROP POLICY IF EXISTS "Clients can view their own data" ON clients;
DROP POLICY IF EXISTS "Clients can update their own profile" ON clients;

-- Create restrictive SELECT policy
CREATE POLICY "Clients can view their own basic data"
ON clients FOR SELECT
USING (auth.uid() = user_id);

-- Create a function to validate client updates (only allow updating safe fields)
CREATE OR REPLACE FUNCTION public.validate_client_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow updates if the user is updating their own record
  IF auth.uid() != NEW.user_id THEN
    RAISE EXCEPTION 'Unauthorized update attempt';
  END IF;

  -- Prevent modification of admin-only fields
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
$$;

-- Create trigger to validate client updates
DROP TRIGGER IF EXISTS validate_client_update_trigger ON clients;
CREATE TRIGGER validate_client_update_trigger
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION public.validate_client_update();

-- Create simple UPDATE policy (validation is handled by trigger)
CREATE POLICY "Clients can update their own profile"
ON clients FOR UPDATE
USING (auth.uid() = user_id);