-- Add status column to clients table
DO $$ BEGIN
  CREATE TYPE client_status AS ENUM ('pending', 'active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS status client_status DEFAULT 'pending'::client_status;