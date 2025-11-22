-- Phase 2A: Create inventory_audit_log table for tracking discrepancies
CREATE TABLE IF NOT EXISTS public.inventory_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  sku_id UUID NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  audit_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Quantities
  app_inventory INT NOT NULL,
  shopify_inventory INT NOT NULL,
  difference INT NOT NULL, -- shopify - app
  
  -- Identifiers for debugging
  inventory_item_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  
  -- Resolution tracking
  status TEXT NOT NULL DEFAULT 'pending', -- pending, auto_corrected, manually_resolved, ignored
  auto_correction_attempted BOOLEAN DEFAULT FALSE,
  auto_correction_success BOOLEAN DEFAULT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  
  -- Audit metadata
  audit_type TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, manual, post_sync
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_inventory_audit_client ON public.inventory_audit_log(client_id, audit_timestamp DESC);
CREATE INDEX idx_inventory_audit_sku_pending ON public.inventory_audit_log(sku_id, status) WHERE status = 'pending';
CREATE INDEX idx_inventory_audit_unresolved ON public.inventory_audit_log(client_id, status, audit_timestamp DESC) WHERE status = 'pending';

-- RLS Policies
ALTER TABLE public.inventory_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all audit logs"
ON public.inventory_audit_log
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Clients can view their own audit logs"
ON public.inventory_audit_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE id = inventory_audit_log.client_id
    AND user_id = auth.uid()
  )
);

-- Add columns to shopify_sync_config for audit configuration
ALTER TABLE public.shopify_sync_config
ADD COLUMN IF NOT EXISTS inventory_audit_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS inventory_audit_frequency TEXT DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS auto_correct_discrepancies BOOLEAN DEFAULT TRUE;

-- Add enhanced logging columns to sync_logs
ALTER TABLE public.sync_logs
ADD COLUMN IF NOT EXISTS discrepancies_found INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS discrepancies_corrected INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT NULL;