-- Add frontend_origin column to oauth_states table to support custom domain redirects
ALTER TABLE public.oauth_states 
ADD COLUMN frontend_origin TEXT;