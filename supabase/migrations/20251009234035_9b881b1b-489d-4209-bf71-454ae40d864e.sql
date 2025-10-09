-- Create a secure function to clear password expiration after successful password change
CREATE OR REPLACE FUNCTION public.clear_password_expiration()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow clearing password_expires_at for the current authenticated user
  UPDATE public.clients
  SET 
    password_expires_at = NULL,
    status = 'active'
  WHERE user_id = auth.uid()
    AND password_expires_at IS NOT NULL;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.clear_password_expiration() TO authenticated;