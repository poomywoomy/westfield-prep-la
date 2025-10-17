-- Create table for OAuth state validation to prevent session hijacking
CREATE TABLE public.oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on oauth_states
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

-- Only allow service role to manage OAuth states
CREATE POLICY "Service role can manage oauth states"
ON public.oauth_states
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');

-- Create index for efficient lookups
CREATE INDEX idx_oauth_states_state ON public.oauth_states(state);
CREATE INDEX idx_oauth_states_expires_at ON public.oauth_states(expires_at);

-- Fix rate_limits RLS policy - restrict to service role only
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;

CREATE POLICY "Only service role can manage rate limits"
ON public.rate_limits
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');

-- Add index for better rate limiting performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON public.rate_limits(rate_key, window_start);

-- Create table for tracking processed webhooks to prevent replay attacks
CREATE TABLE public.processed_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id TEXT NOT NULL UNIQUE,
  shop_domain TEXT NOT NULL,
  topic TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on processed_webhooks
ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;

-- Only service role can manage processed webhooks
CREATE POLICY "Service role can manage processed webhooks"
ON public.processed_webhooks
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');

-- Create index for webhook ID lookups
CREATE INDEX idx_processed_webhooks_webhook_id ON public.processed_webhooks(webhook_id);

-- Auto-cleanup old OAuth states and processed webhooks
CREATE OR REPLACE FUNCTION public.cleanup_old_oauth_states()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.oauth_states WHERE expires_at < now();
  DELETE FROM public.processed_webhooks WHERE processed_at < now() - INTERVAL '7 days';
END;
$$;