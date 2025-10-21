-- Phase 5: Create adjustment-photos storage bucket with RLS policies

-- Create bucket for adjustment photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('adjustment-photos', 'adjustment-photos', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Allow authenticated users to upload adjustment photos
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'adjustment-photos');

-- RLS Policy: Allow users to view adjustment photos
CREATE POLICY "Allow view adjustment photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'adjustment-photos');

-- RLS Policy: Allow users to delete their own adjustment photos
CREATE POLICY "Allow delete own adjustment photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'adjustment-photos');