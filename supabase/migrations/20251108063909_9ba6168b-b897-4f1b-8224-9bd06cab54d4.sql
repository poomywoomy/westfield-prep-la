-- Fix adjustment-photos storage bucket RLS policies
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can upload adjustment photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view adjustment photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete adjustment photos" ON storage.objects;

-- Create client-scoped policies for adjustment photos

-- Allow clients to upload to their own folder only
CREATE POLICY "Clients can upload their adjustment photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'adjustment-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Allow clients to view only their own files
CREATE POLICY "Clients can view their adjustment photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'adjustment-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Allow clients to update only their own files
CREATE POLICY "Clients can update their adjustment photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'adjustment-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Allow clients to delete only their own files  
CREATE POLICY "Clients can delete their adjustment photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'adjustment-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Allow admins full access to all adjustment photos
CREATE POLICY "Admins can manage all adjustment photos"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'adjustment-photos' AND
  public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'adjustment-photos' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);