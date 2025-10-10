-- Create a function to allow users to delete their own client account
CREATE OR REPLACE FUNCTION public.delete_own_client_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_client_id uuid;
  v_user_id uuid;
BEGIN
  -- Get the current user's ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Get the client_id for this user
  SELECT id INTO v_client_id
  FROM public.clients
  WHERE user_id = v_user_id;
  
  IF v_client_id IS NULL THEN
    RAISE EXCEPTION 'No client account found';
  END IF;
  
  -- Delete all dependent records (in order)
  DELETE FROM public.billing_charges WHERE client_id = v_client_id;
  DELETE FROM public.custom_pricing WHERE client_id = v_client_id;
  DELETE FROM public.qc_images WHERE client_id = v_client_id;
  DELETE FROM public.quotes WHERE client_id = v_client_id;
  
  -- Delete the client record
  DELETE FROM public.clients WHERE id = v_client_id;
  
  -- Delete user_roles
  DELETE FROM public.user_roles WHERE user_id = v_user_id;
  
  -- Delete profile
  DELETE FROM public.profiles WHERE id = v_user_id;
  
  -- Delete auth user (this will cascade if configured)
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;