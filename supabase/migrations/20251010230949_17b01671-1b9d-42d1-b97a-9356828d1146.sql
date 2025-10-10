-- Create table for document generation history
CREATE TABLE public.generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type text NOT NULL,
  client_name_1 text,
  client_name_2 text,
  generated_date date NOT NULL DEFAULT CURRENT_DATE,
  generated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all documents"
ON public.generated_documents
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_generated_documents_created_at ON public.generated_documents(created_at DESC);