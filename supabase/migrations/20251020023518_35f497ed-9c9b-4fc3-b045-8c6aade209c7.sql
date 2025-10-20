-- Drop policies that depend on the status column
DROP POLICY IF EXISTS "Clients can update their draft ASNs" ON public.asn_headers;
DROP POLICY IF EXISTS "Clients can insert lines on their draft ASNs" ON public.asn_lines;
DROP POLICY IF EXISTS "Clients can add attachments to their draft ASNs" ON public.asn_attachments;
DROP POLICY IF EXISTS "Clients can upload to their draft ASNs storage" ON storage.objects;

-- Create new enum type for ASN status
CREATE TYPE asn_status_new AS ENUM ('not_received', 'receiving', 'closed');

-- Add new status column
ALTER TABLE public.asn_headers 
ADD COLUMN status_new asn_status_new DEFAULT 'not_received';

-- Migrate existing data
UPDATE public.asn_headers
SET status_new = CASE 
  WHEN status::text = 'draft' THEN 'not_received'::asn_status_new
  WHEN status::text = 'submitted' THEN 'not_received'::asn_status_new
  WHEN status::text = 'in_progress' THEN 'receiving'::asn_status_new
  WHEN status::text = 'received' THEN 'closed'::asn_status_new
  ELSE 'not_received'::asn_status_new
END;

-- Drop old status column and enum
ALTER TABLE public.asn_headers DROP COLUMN status;
DROP TYPE IF EXISTS asn_status;

-- Rename new column and type
ALTER TABLE public.asn_headers RENAME COLUMN status_new TO status;
ALTER TYPE asn_status_new RENAME TO asn_status;

-- Recreate policies with updated status values
CREATE POLICY "Clients can update their draft ASNs" 
ON public.asn_headers 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = asn_headers.client_id 
    AND clients.user_id = auth.uid()
  ) 
  AND status = 'not_received'
);

CREATE POLICY "Clients can insert lines on their draft ASNs" 
ON public.asn_lines 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.asn_headers 
    JOIN public.clients ON clients.id = asn_headers.client_id
    WHERE asn_headers.id = asn_lines.asn_id 
    AND clients.user_id = auth.uid()
    AND asn_headers.status = 'not_received'
  )
);

CREATE POLICY "Clients can add attachments to their draft ASNs" 
ON public.asn_attachments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.asn_headers 
    JOIN public.clients ON clients.id = asn_headers.client_id
    WHERE asn_headers.id = asn_attachments.asn_id 
    AND clients.user_id = auth.uid()
    AND asn_headers.status = 'not_received'
  )
);

CREATE POLICY "Clients can upload to their draft ASNs storage" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'asn-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.asn_headers 
    JOIN public.clients ON clients.id = asn_headers.client_id
    WHERE asn_headers.id::text = (storage.foldername(name))[2]
    AND clients.user_id = auth.uid()
    AND asn_headers.status = 'not_received'
  )
);

-- Add missing_units column to asn_lines
ALTER TABLE public.asn_lines
ADD COLUMN IF NOT EXISTS missing_units integer NOT NULL DEFAULT 0;