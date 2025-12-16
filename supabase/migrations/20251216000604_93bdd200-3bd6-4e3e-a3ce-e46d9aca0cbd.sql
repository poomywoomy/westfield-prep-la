-- Create chatbot configuration table for feature flag
CREATE TABLE IF NOT EXISTS public.chatbot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chatbot_config ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read access for chatbot_enabled flag only
CREATE POLICY "Public can read chatbot_enabled config"
ON public.chatbot_config
FOR SELECT
TO anon, authenticated
USING (key = 'chatbot_enabled');

-- Only admins can modify chatbot config
CREATE POLICY "Admins can manage chatbot config"
ON public.chatbot_config
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert initial chatbot_enabled = true
INSERT INTO public.chatbot_config (key, value)
VALUES ('chatbot_enabled', '{"enabled": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;