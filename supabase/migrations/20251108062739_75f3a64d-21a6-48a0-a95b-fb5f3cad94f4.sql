-- Enable pg_cron for automated syncing
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create cron job to sync Shopify orders every 5 minutes
-- This will call the shopify-sync-orders edge function for all active clients
SELECT cron.schedule(
  'shopify-sync-orders-5min',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://gqnvkecmxjijrxhggcro.supabase.co/functions/v1/shopify-sync-orders',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object('auto_sync', true)
    ) AS request_id;
  $$
);

-- Create cron job to sync Shopify products every 5 minutes
SELECT cron.schedule(
  'shopify-auto-sync-5min',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://gqnvkecmxjijrxhggcro.supabase.co/functions/v1/shopify-auto-sync',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    ) AS request_id;
  $$
);

-- Create cron job to sync Shopify inventory every 5 minutes
SELECT cron.schedule(
  'shopify-sync-inventory-5min',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://gqnvkecmxjijrxhggcro.supabase.co/functions/v1/shopify-sync-inventory',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object('auto_sync', true)
    ) AS request_id;
  $$
);

COMMENT ON EXTENSION pg_cron IS 'Enables automated Shopify sync jobs every 5 minutes';
