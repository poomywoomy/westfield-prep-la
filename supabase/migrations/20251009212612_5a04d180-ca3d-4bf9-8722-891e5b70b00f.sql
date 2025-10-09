-- Remove temp_password column from clients table for security
-- Temporary passwords should never be stored in the database
-- They are sent via email only and validated through password_expires_at
ALTER TABLE public.clients DROP COLUMN IF EXISTS temp_password;