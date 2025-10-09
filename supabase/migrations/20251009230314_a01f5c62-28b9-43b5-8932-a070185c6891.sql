-- Add INSERT policy for audit_log table
-- This allows the audit_trigger to properly insert records
CREATE POLICY "System can insert audit logs"
ON public.audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add comment explaining the policy
COMMENT ON POLICY "System can insert audit logs" ON public.audit_log IS 
'Allows authenticated operations to create audit log entries via the audit_trigger function';