-- Add section_type column to custom_pricing to preserve quote structure
ALTER TABLE public.custom_pricing
ADD COLUMN section_type text DEFAULT 'Standard Operations';

-- Add comment explaining the section types
COMMENT ON COLUMN public.custom_pricing.section_type IS 'Section type from quote: Standard Operations, Amazon FBA, Walmart WFS, TikTok Shop, Self Fulfillment, Team Quote';