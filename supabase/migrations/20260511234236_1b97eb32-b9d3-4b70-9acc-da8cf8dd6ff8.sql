
DROP POLICY IF EXISTS "System can insert sync logs" ON public.sync_logs;
DROP POLICY IF EXISTS "System can insert webhook logs" ON public.webhook_delivery_logs;
DROP POLICY IF EXISTS "Service role can insert barcode scans" ON public.barcode_scans;
DROP POLICY IF EXISTS "Service role can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "System can insert compliance webhooks" ON public.compliance_webhooks;
DROP POLICY IF EXISTS "Service role can manage translations" ON public.translations;

DROP POLICY IF EXISTS "Anyone can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view blog images" ON storage.objects;

DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow view adjustment photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete own adjustment photos" ON storage.objects;

REVOKE EXECUTE ON FUNCTION public.audit_trigger() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_client_update() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_oauth_state_not_expired() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalculate_quote_line_total() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_shopify_inventory_sync() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_attachments() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_oauth_states() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_rate_limits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_sync_logs() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.activate_client_on_login() FROM anon;
REVOKE EXECUTE ON FUNCTION public.clear_password_expiration() FROM anon;
REVOKE EXECUTE ON FUNCTION public.delete_own_client_account() FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_asn_number(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_removal_order_number(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_shipment_number(uuid) FROM anon;
