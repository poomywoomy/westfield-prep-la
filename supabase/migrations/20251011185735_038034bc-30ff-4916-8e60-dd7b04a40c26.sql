-- Add damage and missing product fields to qc_images table
ALTER TABLE public.qc_images 
ADD COLUMN is_damaged boolean DEFAULT false,
ADD COLUMN damage_quantity integer DEFAULT 0,
ADD COLUMN is_missing boolean DEFAULT false,
ADD COLUMN missing_quantity integer DEFAULT 0,
ADD COLUMN notes text;

-- Create storage bucket for QC images
INSERT INTO storage.buckets (id, name, public)
VALUES ('qc-images', 'qc-images', false);

-- Storage policies for QC images
CREATE POLICY "Admins can upload QC images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'qc-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can view all QC images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'qc-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Clients can view their own QC images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'qc-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can delete QC images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'qc-images'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Clients can download their QC images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'qc-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.clients WHERE user_id = auth.uid()
  )
);