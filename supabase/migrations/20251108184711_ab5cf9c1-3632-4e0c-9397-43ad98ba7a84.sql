-- Add response_code column to webhook_delivery_logs table
ALTER TABLE webhook_delivery_logs 
ADD COLUMN response_code integer;

-- Add index for performance when querying by response code
CREATE INDEX IF NOT EXISTS idx_webhook_delivery_logs_response_code 
ON webhook_delivery_logs(response_code);

-- Add comment for documentation
COMMENT ON COLUMN webhook_delivery_logs.response_code IS 'HTTP response code returned to Shopify after processing webhook';