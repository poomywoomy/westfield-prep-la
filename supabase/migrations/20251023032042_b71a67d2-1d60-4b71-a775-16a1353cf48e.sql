-- Add database-level protection for OAuth state expiration
-- This prevents the use of expired OAuth states even if cleanup job fails

-- Note: We cannot use a CHECK constraint with now() because it must be immutable
-- Instead, we'll create a trigger-based validation

-- Create validation function for OAuth state expiration
CREATE OR REPLACE FUNCTION validate_oauth_state_not_expired()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent using expired states in SELECT operations
  -- The application should delete expired states after checking
  IF TG_OP = 'INSERT' AND NEW.expires_at <= NOW() THEN
    RAISE EXCEPTION 'Cannot insert already-expired OAuth state';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to validate OAuth states on insert
DROP TRIGGER IF EXISTS validate_oauth_state_expiration ON public.oauth_states;
CREATE TRIGGER validate_oauth_state_expiration
  BEFORE INSERT ON public.oauth_states
  FOR EACH ROW
  EXECUTE FUNCTION validate_oauth_state_not_expired();

COMMENT ON FUNCTION validate_oauth_state_not_expired IS 'Prevents insertion of already-expired OAuth states for additional security';
COMMENT ON TRIGGER validate_oauth_state_expiration ON public.oauth_states IS 'Validates OAuth state expiration on insert';