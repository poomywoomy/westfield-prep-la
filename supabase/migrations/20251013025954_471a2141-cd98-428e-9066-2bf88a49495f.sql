-- Fix the delete_own_client_account function to properly handle account deletion
-- This addresses the security issue where the function tries to delete from auth.users
-- which is restricted and will fail, leaving orphaned data

-- Drop the old function
DROP FUNCTION IF EXISTS public.delete_own_client_account();

-- Create an improved version that:
-- 1. Doesn't try to delete from auth.users (admins must use Supabase Admin API)
-- 2. Deletes all related data including billing cycles
-- 3. Uses proper transaction handling
-- 4. Returns information about what was deleted

CREATE OR REPLACE FUNCTION public.delete_own_client_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_client_id uuid;
  v_user_id uuid;
  v_deleted_records jsonb;
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
  
  -- Track what we're deleting (for audit purposes)
  v_deleted_records := jsonb_build_object(
    'client_id', v_client_id,
    'user_id', v_user_id,
    'deleted_at', now()
  );
  
  -- Delete all dependent records (in proper order to respect foreign keys)
  -- Note: Storage files must be deleted separately via client-side code or admin function
  
  -- Delete billing-related records
  DELETE FROM public.monthly_billing_items 
  WHERE cycle_id IN (
    SELECT id FROM public.monthly_billing_cycles WHERE client_id = v_client_id
  );
  
  DELETE FROM public.billing_payments WHERE client_id = v_client_id;
  DELETE FROM public.monthly_billing_cycles WHERE client_id = v_client_id;
  DELETE FROM public.billing_charges WHERE client_id = v_client_id;
  
  -- Delete other client-related records
  DELETE FROM public.custom_pricing WHERE client_id = v_client_id;
  DELETE FROM public.qc_images WHERE client_id = v_client_id;
  DELETE FROM public.quotes WHERE client_id = v_client_id;
  
  -- Delete the client record
  DELETE FROM public.clients WHERE id = v_client_id;
  
  -- Delete user_roles
  DELETE FROM public.user_roles WHERE user_id = v_user_id;
  
  -- Delete profile
  DELETE FROM public.profiles WHERE id = v_user_id;
  
  -- Note: Auth user deletion must be handled separately by admin
  -- Clients cannot delete their own auth.users record directly
  -- The auth user will be orphaned but can be cleaned up by admin
  
  RETURN v_deleted_records;
END;
$$;

-- Add comment explaining usage
COMMENT ON FUNCTION public.delete_own_client_account() IS 
'Allows clients to delete their own account data. Note: Does not delete auth.users record - that must be done by admin via Supabase Admin API. Returns JSON with deleted record information.';