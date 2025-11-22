-- Add CANCELLATION_INCREMENT to ledger_type enum for order cancellations
ALTER TYPE ledger_type ADD VALUE IF NOT EXISTS 'CANCELLATION_INCREMENT';