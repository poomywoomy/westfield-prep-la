-- Add missing RLS policies for newly created tables
-- This migration completes the RLS security for shipment_requests, support_tickets, and related tables

-- ============================================
-- SHIPMENT REQUESTS - Client UPDATE policy
-- ============================================
CREATE POLICY "Clients can update own pending shipment requests"
ON public.shipment_requests
FOR UPDATE
TO authenticated
USING (
  status = 'pending' AND
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = shipment_requests.client_id 
    AND clients.user_id = auth.uid()
  )
);

-- ============================================
-- SHIPMENT REQUESTS - Client DELETE policy
-- ============================================
CREATE POLICY "Clients can delete own pending shipment requests"
ON public.shipment_requests
FOR DELETE
TO authenticated
USING (
  status = 'pending' AND
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = shipment_requests.client_id 
    AND clients.user_id = auth.uid()
  )
);

-- ============================================
-- SUPPORT TICKETS - Client UPDATE policy
-- ============================================
CREATE POLICY "Clients can update own support tickets"
ON public.support_tickets
FOR UPDATE
TO authenticated
USING (
  status != 'closed' AND
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = support_tickets.client_id 
    AND clients.user_id = auth.uid()
  )
);

-- ============================================
-- SUPPORT TICKETS - Client DELETE policy
-- ============================================
CREATE POLICY "Clients can delete own pending support tickets"
ON public.support_tickets
FOR DELETE
TO authenticated
USING (
  status = 'pending' AND
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = support_tickets.client_id 
    AND clients.user_id = auth.uid()
  )
);

-- ============================================
-- SHIPMENT REQUEST LINES - Client UPDATE policy
-- ============================================
CREATE POLICY "Clients can update own pending shipment request lines"
ON public.shipment_request_lines
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.shipment_requests sr
    JOIN public.clients c ON c.id = sr.client_id
    WHERE sr.id = shipment_request_lines.request_id
    AND sr.status = 'pending'
    AND c.user_id = auth.uid()
  )
);

-- ============================================
-- SHIPMENT REQUEST LINES - Client DELETE policy
-- ============================================
CREATE POLICY "Clients can delete own pending shipment request lines"
ON public.shipment_request_lines
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.shipment_requests sr
    JOIN public.clients c ON c.id = sr.client_id
    WHERE sr.id = shipment_request_lines.request_id
    AND sr.status = 'pending'
    AND c.user_id = auth.uid()
  )
);

-- ============================================
-- Add CHECK constraints for quantity bounds
-- ============================================
ALTER TABLE public.shipment_request_lines
ADD CONSTRAINT quantity_bounds 
CHECK (quantity > 0 AND quantity <= 100000);

ALTER TABLE public.asn_lines
ADD CONSTRAINT expected_units_bounds
CHECK (expected_units >= 0 AND expected_units <= 100000);

-- ============================================
-- Add unique constraint for webhook idempotency
-- ============================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_inventory_ledger_shopify
ON public.inventory_ledger(shopify_order_id, shopify_fulfillment_id)
WHERE transaction_type = 'SALE_DECREMENT' 
  AND shopify_order_id IS NOT NULL;