-- Add password_expires_at column back for temporary password tracking
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS password_expires_at TIMESTAMPTZ;

COMMENT ON COLUMN public.clients.password_expires_at IS 'Tracks when temporary password expires (24 hours after creation)';