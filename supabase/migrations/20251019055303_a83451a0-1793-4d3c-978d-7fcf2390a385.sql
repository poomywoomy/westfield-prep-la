-- Add image_url column to client_skus for SKU photos
ALTER TABLE public.client_skus ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create sku-images storage bucket for SKU photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sku-images', 'sku-images', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for sku-images bucket
CREATE POLICY "Admins can upload SKU images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'sku-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can view all SKU images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'sku-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Clients can view their SKU images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'sku-images' 
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update SKU images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'sku-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete SKU images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'sku-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);