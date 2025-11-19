-- Create lead_magnet_downloads table
CREATE TABLE IF NOT EXISTS public.lead_magnet_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  guide_type TEXT NOT NULL DEFAULT 'fulfillment_partner_guide',
  download_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for email lookups
CREATE INDEX idx_lead_magnet_email ON public.lead_magnet_downloads(email);

-- Enable RLS
ALTER TABLE public.lead_magnet_downloads ENABLE ROW LEVEL SECURITY;

-- Admin can see all downloads
CREATE POLICY "Admins can view all lead downloads"
ON public.lead_magnet_downloads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow public insert (for lead capture form)
CREATE POLICY "Anyone can submit lead magnet form"
ON public.lead_magnet_downloads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);