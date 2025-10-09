-- Fix search_path for delete_expired_qc_images function
CREATE OR REPLACE FUNCTION public.delete_expired_qc_images()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.qc_images
  WHERE expires_at < now();
END;
$$;