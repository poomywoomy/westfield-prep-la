-- Fix SECURITY DEFINER views by recreating with security_invoker=true
-- This ensures views use the querying user's permissions, not the view creator's

-- 1. Fix inventory_summary view
DROP VIEW IF EXISTS public.inventory_summary CASCADE;
CREATE VIEW public.inventory_summary
WITH (security_invoker=true) AS
SELECT 
  s.id AS sku_id,
  s.client_id,
  s.internal_sku,
  s.client_sku,
  l.location_id,
  COALESCE(sum(l.qty_delta) FILTER (WHERE (l.transaction_type <> ALL (ARRAY['RESERVE'::ledger_type, 'RELEASE'::ledger_type]))), 0::bigint) AS on_hand,
  COALESCE(sum(l.qty_delta) FILTER (WHERE (l.transaction_type = 'RESERVE'::ledger_type)), 0::bigint) AS reserved,
  COALESCE(sum(l.qty_delta), 0::bigint) AS available
FROM skus s
LEFT JOIN inventory_ledger l ON s.id = l.sku_id
WHERE s.status = 'active'
GROUP BY s.id, s.client_id, s.internal_sku, s.client_sku, l.location_id;

-- 2. Fix inventory_discrepancies_summary view
DROP VIEW IF EXISTS public.inventory_discrepancies_summary CASCADE;
CREATE VIEW public.inventory_discrepancies_summary
WITH (security_invoker=true) AS
SELECT 
  ah.client_id,
  al.sku_id,
  s.client_sku,
  s.title,
  s.image_url,
  ah.asn_number,
  ah.id AS asn_id,
  sum(al.damaged_units) AS damaged_qty,
  sum(al.missing_units) AS missing_qty,
  sum(al.quarantined_units) AS quarantined_qty,
  ah.received_at,
  ah.status,
  ah.created_at
FROM asn_lines al
JOIN asn_headers ah ON ah.id = al.asn_id
JOIN skus s ON s.id = al.sku_id
WHERE (al.damaged_units > 0 OR al.missing_units > 0 OR al.quarantined_units > 0)
  AND ah.status = 'issue'::asn_status
GROUP BY ah.client_id, al.sku_id, s.client_sku, s.title, s.image_url, ah.asn_number, ah.id, ah.received_at, ah.status, ah.created_at;

-- 3. Fix inventory_summary_complete view (depends on inventory_summary)
DROP VIEW IF EXISTS public.inventory_summary_complete CASCADE;
CREATE VIEW public.inventory_summary_complete
WITH (security_invoker=true) AS
SELECT 
  s.id AS sku_id,
  s.client_id,
  s.internal_sku,
  s.client_sku,
  s.title,
  s.image_url,
  isummary.location_id,
  loc.name AS location_name,
  COALESCE(isummary.on_hand, 0::bigint) AS on_hand,
  COALESCE(isummary.reserved, 0::bigint) AS reserved,
  COALESCE(isummary.available, 0::bigint) AS available
FROM skus s
LEFT JOIN inventory_summary isummary ON s.id = isummary.sku_id
LEFT JOIN locations loc ON isummary.location_id = loc.id
WHERE s.status = 'active';

-- 4. Fix webhook_recent_failures view
DROP VIEW IF EXISTS public.webhook_recent_failures CASCADE;
CREATE VIEW public.webhook_recent_failures
WITH (security_invoker=true) AS
SELECT 
  shop_domain,
  topic,
  status,
  error_message,
  created_at,
  webhook_id
FROM webhook_delivery_logs
WHERE status = 'failed'
  AND created_at > (now() - INTERVAL '24 hours')
ORDER BY created_at DESC;