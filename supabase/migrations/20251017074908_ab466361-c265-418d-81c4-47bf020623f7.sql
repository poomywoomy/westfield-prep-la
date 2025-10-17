-- Fix hardcoded anon key in cron job by using service role authentication
-- Drop the old cron job with hardcoded key
SELECT cron.unschedule('shopify-auto-sync-hourly');

-- Create new cron job using service_role authentication
-- Note: The service role key should be configured in the database as an environment variable
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