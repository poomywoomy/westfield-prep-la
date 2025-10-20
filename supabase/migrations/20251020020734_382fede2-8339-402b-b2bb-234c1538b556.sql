-- Add section_type column to bill_items table to track which quote section each service belongs to
ALTER TABLE public.bill_items 
ADD COLUMN section_type text DEFAULT 'Standard Operations';