-- Move extensions from public schema to dedicated extensions schema
-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_cron extension to extensions schema
DROP EXTENSION IF EXISTS pg_cron CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Move pg_net extension to extensions schema  
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Update search_path to include extensions schema for cron jobs
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Recreate the cron job (cron functions now accessible via search_path)
SELECT cron.schedule(
  'shopify-auto-sync-hourly-secure',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url', true) || '/functions/v1/shopify-auto-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := jsonb_build_object('scheduled', true, 'timestamp', NOW())
  ) AS request_id;
  $$
);

-- Recreate the daily cleanup cron job
SELECT cron.schedule(
  'cleanup-sync-logs-daily',
  '0 2 * * *',
  'SELECT cleanup_old_sync_logs();'
);