-- Make qc-images bucket public so clients can view images
UPDATE storage.buckets 
SET public = true 
WHERE id = 'qc-images';