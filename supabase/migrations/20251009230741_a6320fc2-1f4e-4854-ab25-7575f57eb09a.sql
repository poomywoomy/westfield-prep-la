-- Create intake_forms table for secure storage of intake form submissions
CREATE TABLE public.intake_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  amazon_seller_name TEXT NOT NULL,
  amazon_seller_central TEXT,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  product_type TEXT NOT NULL,
  estimated_monthly_volume INTEGER NOT NULL DEFAULT 0,
  average_units_per_shipment INTEGER,
  need_receiving BOOLEAN NOT NULL DEFAULT false,
  need_inspection BOOLEAN NOT NULL DEFAULT false,
  need_labeling BOOLEAN NOT NULL DEFAULT false,
  need_bundling BOOLEAN NOT NULL DEFAULT false,
  need_shipping BOOLEAN NOT NULL DEFAULT false,
  need_storage BOOLEAN NOT NULL DEFAULT false,
  special_requirements TEXT,
  hazmat_products TEXT NOT NULL,
  preferred_shipping_carrier TEXT,
  referral_source TEXT,
  agreed_to_deposit BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS on intake_forms
ALTER TABLE public.intake_forms ENABLE ROW LEVEL SECURITY;

-- Only admins can view intake forms
CREATE POLICY "Admins can view all intake forms"
ON public.intake_forms
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit an intake form (public submission)
CREATE POLICY "Anyone can submit intake forms"
ON public.intake_forms
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can update intake forms
CREATE POLICY "Admins can update intake forms"
ON public.intake_forms
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policies for all existing tables

-- Admins can delete audit logs
CREATE POLICY "Admins can delete audit logs"
ON public.audit_log
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete billing charges
CREATE POLICY "Admins can delete billing charges"
ON public.billing_charges
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete clients
CREATE POLICY "Admins can delete clients"
ON public.clients
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete custom pricing
CREATE POLICY "Admins can delete custom pricing"
ON public.custom_pricing
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete QC images
CREATE POLICY "Admins can delete qc images"
ON public.qc_images
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete quotes
CREATE POLICY "Admins can delete quotes"
ON public.quotes
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete user roles
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete intake forms
CREATE POLICY "Admins can delete intake forms"
ON public.intake_forms
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_intake_forms_email ON public.intake_forms(email);
CREATE INDEX idx_intake_forms_status ON public.intake_forms(status);
CREATE INDEX idx_intake_forms_created_at ON public.intake_forms(created_at DESC);