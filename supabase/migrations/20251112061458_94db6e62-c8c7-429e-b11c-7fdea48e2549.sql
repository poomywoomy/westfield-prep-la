-- Create qc_images table for tracking QC photos for auto-deletion
CREATE TABLE IF NOT EXISTS public.qc_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

-- Create index for efficient cleanup queries
CREATE INDEX IF NOT EXISTS idx_qc_images_expires_at ON public.qc_images(expires_at);
CREATE INDEX IF NOT EXISTS idx_qc_images_client_id ON public.qc_images(client_id);
CREATE INDEX IF NOT EXISTS idx_qc_images_file_path ON public.qc_images(file_path);

-- Enable RLS
ALTER TABLE public.qc_images ENABLE ROW LEVEL SECURITY;

-- Admins can manage all QC images
CREATE POLICY "Admins can manage all QC images"
ON public.qc_images
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Clients can view their own QC images
CREATE POLICY "Clients can view their own QC images"
ON public.qc_images
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = qc_images.client_id
    AND clients.user_id = auth.uid()
  )
);

COMMENT ON TABLE public.qc_images IS 'Tracks QC photo metadata for 30-day auto-deletion by cleanup-qc-photos edge function';
COMMENT ON COLUMN public.qc_images.expires_at IS 'Auto-set to 30 days from created_at for cleanup job';
COMMENT ON COLUMN public.qc_images.file_path IS 'Storage path in qc-images bucket (e.g. ABC-202511-001/line_id/timestamp_file.jpg)';
COMMENT ON COLUMN public.qc_images.image_url IS 'Signed URL for display (regenerated on query)';