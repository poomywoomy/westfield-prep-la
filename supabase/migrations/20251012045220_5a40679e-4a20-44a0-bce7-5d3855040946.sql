-- Fix STORAGE_EXPOSURE: Make qc-images bucket private and add RLS policies

-- Make the qc-images bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'qc-images';

-- Add RLS policies for storage.objects

-- Admins can manage all files in qc-images bucket
CREATE POLICY "Admins can manage all qc-images files"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'qc-images' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'qc-images' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Clients can view their own QC images and pricing documents
CREATE POLICY "Clients can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'qc-images' AND
  (storage.foldername(name))[1]::uuid IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);