-- Phase 1: Add 'issue' status to asn_status enum
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'issue' 
    AND enumtypid = 'asn_status'::regtype
  ) THEN
    ALTER TYPE asn_status ADD VALUE 'issue';
  END IF;
END $$;

-- Add resolution tracking columns to asn_headers
ALTER TABLE public.asn_headers 
ADD COLUMN IF NOT EXISTS resolved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS resolved_by uuid;

-- Add comments for documentation
COMMENT ON COLUMN public.asn_headers.resolved_at IS 'Timestamp when an issue status was manually resolved by admin';
COMMENT ON COLUMN public.asn_headers.resolved_by IS 'User ID of admin who resolved the issue';

-- Create storage policies for QC images (qc-images bucket already exists)
DO $$
BEGIN
  -- Admins can upload QC images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload QC images'
  ) THEN
    CREATE POLICY "Admins can upload QC images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'qc-images' AND
      (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
    );
  END IF;

  -- Admins can view QC images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can view QC images'
  ) THEN
    CREATE POLICY "Admins can view QC images"
    ON storage.objects
    FOR SELECT
    USING (
      bucket_id = 'qc-images' AND
      (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
    );
  END IF;

  -- Clients can view their QC images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Clients can view their QC images'
  ) THEN
    CREATE POLICY "Clients can view their QC images"
    ON storage.objects
    FOR SELECT
    USING (
      bucket_id = 'qc-images' AND
      (
        EXISTS (
          SELECT 1 FROM asn_headers ah
          JOIN clients c ON c.id = ah.client_id
          WHERE c.user_id = auth.uid()
          AND (storage.foldername(name))[1] = ah.asn_number
        )
      )
    );
  END IF;

  -- Admins can delete QC images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete QC images'
  ) THEN
    CREATE POLICY "Admins can delete QC images"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'qc-images' AND
      (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
    );
  END IF;
END $$;