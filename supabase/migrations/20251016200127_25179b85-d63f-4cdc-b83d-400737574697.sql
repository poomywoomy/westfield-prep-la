-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule hourly automatic product sync
SELECT cron.schedule(
  'shopify-auto-sync-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://gqnvkecmxjijrxhggcro.supabase.co/functions/v1/shopify-auto-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbnZrZWNteGppanJ4aGdnY3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDA1NjMsImV4cCI6MjA3NDkxNjU2M30.9lYv5DtHc_qIsKC2H38yKdSuCTyQPZLhV6hAKiN3xh0'
    ),
    body := jsonb_build_object('scheduled', true, 'timestamp', NOW())
  ) AS request_id;
  $$
);

-- Schedule daily log cleanup at 2 AM
SELECT cron.schedule(
  'cleanup-sync-logs-daily',
  '0 2 * * *',
  'SELECT cleanup_old_sync_logs();'
);