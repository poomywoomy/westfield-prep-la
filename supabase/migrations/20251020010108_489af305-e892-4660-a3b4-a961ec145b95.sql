-- Create storage bucket for ASN attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('asn-attachments', 'asn-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for asn-attachments bucket
CREATE POLICY "Admins can manage all ASN attachments storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'asn-attachments' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own ASN attachments storage"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'asn-attachments' AND
  EXISTS (
    SELECT 1 FROM asn_headers
    JOIN clients ON clients.id = asn_headers.client_id
    WHERE asn_headers.id::text = (storage.foldername(name))[1]
    AND clients.user_id = auth.uid()
  )
);

CREATE POLICY "Clients can upload to their draft ASNs storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'asn-attachments' AND
  EXISTS (
    SELECT 1 FROM asn_headers
    JOIN clients ON clients.id = asn_headers.client_id
    WHERE asn_headers.id::text = (storage.foldername(name))[1]
    AND clients.user_id = auth.uid()
    AND asn_headers.status = 'draft'
  )
);