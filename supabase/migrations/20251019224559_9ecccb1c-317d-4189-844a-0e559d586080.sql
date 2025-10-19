-- Create function to cleanup expired attachments
CREATE OR REPLACE FUNCTION public.cleanup_expired_attachments()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete expired attachment records
  -- Note: Storage files must be deleted via separate storage cleanup process
  WITH deleted AS (
    DELETE FROM public.attachments
    WHERE expires_at IS NOT NULL 
      AND expires_at < NOW()
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;
  
  RETURN deleted_count;
END;
$$;

-- Schedule daily cleanup at 2 AM using pg_cron
-- This requires pg_cron extension to be enabled
SELECT cron.schedule(
  'cleanup-expired-attachments',
  '0 2 * * *',  -- Daily at 2 AM UTC
  $$SELECT public.cleanup_expired_attachments()$$
);