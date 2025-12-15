-- Add explicit anonymous deny policies for sensitive tables
-- This prevents any access via anon key to tables containing PII

-- 1. Profiles table - contains PII (email, phone, full_name)
CREATE POLICY "profiles_block_anonymous"
ON public.profiles FOR ALL
TO anon
USING (false);

-- 2. Support tickets - contains contact info and system details
CREATE POLICY "support_tickets_block_anonymous"
ON public.support_tickets FOR ALL
TO anon
USING (false);

-- 3. Clients table - contains PII (email, phone, company info)
CREATE POLICY "clients_block_anonymous"
ON public.clients FOR ALL
TO anon
USING (false);

-- 4. User roles table - security sensitive
CREATE POLICY "user_roles_block_anonymous"
ON public.user_roles FOR ALL
TO anon
USING (false);

-- 5. Billing payments - financial data
CREATE POLICY "billing_payments_block_anonymous"
ON public.billing_payments FOR ALL
TO anon
USING (false);

-- 6. Bills - financial data
CREATE POLICY "bills_block_anonymous"
ON public.bills FOR ALL
TO anon
USING (false);

-- 7. Payments - financial data
CREATE POLICY "payments_block_anonymous"
ON public.payments FOR ALL
TO anon
USING (false);

-- 8. Invoices - financial data
CREATE POLICY "invoices_block_anonymous"
ON public.invoices FOR ALL
TO anon
USING (false);

-- 9. OAuth states - security sensitive
CREATE POLICY "oauth_states_block_anonymous"
ON public.oauth_states FOR ALL
TO anon
USING (false);

-- 10. Shopify stores - contains access tokens
CREATE POLICY "shopify_stores_block_anonymous"
ON public.shopify_stores FOR ALL
TO anon
USING (false);

-- 11. Shopify webhooks - security sensitive
CREATE POLICY "shopify_webhooks_block_anonymous"
ON public.shopify_webhooks FOR ALL
TO anon
USING (false);

-- 12. Shopify orders - customer PII
CREATE POLICY "shopify_orders_block_anonymous"
ON public.shopify_orders FOR ALL
TO anon
USING (false);

-- 13. Shopify returns - customer data
CREATE POLICY "shopify_returns_block_anonymous"
ON public.shopify_returns FOR ALL
TO anon
USING (false);

-- 14. Audit log - security sensitive
CREATE POLICY "audit_log_block_anonymous"
ON public.audit_log FOR ALL
TO anon
USING (false);

-- 15. Damaged item decisions - client data
CREATE POLICY "damaged_item_decisions_block_anonymous"
ON public.damaged_item_decisions FOR ALL
TO anon
USING (false);

-- 16. ASN headers - client business data
CREATE POLICY "asn_headers_block_anonymous"
ON public.asn_headers FOR ALL
TO anon
USING (false);

-- 17. ASN lines - client business data
CREATE POLICY "asn_lines_block_anonymous"
ON public.asn_lines FOR ALL
TO anon
USING (false);

-- 18. SKUs - client inventory data
CREATE POLICY "skus_block_anonymous"
ON public.skus FOR ALL
TO anon
USING (false);

-- 19. Inventory ledger - client data
CREATE POLICY "inventory_ledger_block_anonymous"
ON public.inventory_ledger FOR ALL
TO anon
USING (false);

-- 20. Outbound shipments - client business data
CREATE POLICY "outbound_shipments_block_anonymous"
ON public.outbound_shipments FOR ALL
TO anon
USING (false);