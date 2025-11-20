-- Fix: Restrict audit log inserts to service role only (INFO_LEAKAGE)
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_log;

CREATE POLICY "Only service role can insert audit logs"
ON public.audit_log
FOR INSERT
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);