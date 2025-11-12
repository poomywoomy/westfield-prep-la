-- Fix CHECK constraints on damaged_item_decisions table

-- Drop existing CHECK constraints that are causing violations
ALTER TABLE damaged_item_decisions 
  DROP CONSTRAINT IF EXISTS damaged_item_decisions_status_check;

ALTER TABLE damaged_item_decisions 
  DROP CONSTRAINT IF EXISTS damaged_item_decisions_decision_check;

-- Add updated status constraint with all values used in code
ALTER TABLE damaged_item_decisions 
  ADD CONSTRAINT damaged_item_decisions_status_check 
  CHECK (status IN ('pending', 'submitted', 'processed', 'closed', 'cancelled'));

-- Add updated decision constraint including return_to_inventory
ALTER TABLE damaged_item_decisions 
  ADD CONSTRAINT damaged_item_decisions_decision_check 
  CHECK (decision IS NULL OR decision IN (
    'discard', 
    'sell_as_bstock', 
    'return_to_inventory', 
    'return_to_sender', 
    'rework', 
    'acknowledge'
  ));

-- Update RLS policy to allow updating submitted status as well
DROP POLICY IF EXISTS "Clients can update their pending decisions" ON damaged_item_decisions;

CREATE POLICY "Clients can update their decisions before processing"
ON damaged_item_decisions
FOR UPDATE
TO authenticated
USING (
  status IN ('pending', 'submitted')
  AND EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = damaged_item_decisions.client_id
    AND clients.user_id = auth.uid()
  )
);