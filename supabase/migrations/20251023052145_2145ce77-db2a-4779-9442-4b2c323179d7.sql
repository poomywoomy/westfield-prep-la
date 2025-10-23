-- ============================================
-- Performance Indexes
-- ============================================

-- ASN tracking and client lookups
CREATE INDEX IF NOT EXISTS idx_asn_headers_tracking ON public.asn_headers(tracking_number) WHERE tracking_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_asn_headers_client_created ON public.asn_headers(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_asn_lines_asn_sku ON public.asn_lines(asn_id, sku_id);

-- SKU lookups by various identifiers
CREATE INDEX IF NOT EXISTS idx_skus_client_status_upc ON public.skus(client_id, status, upc) WHERE upc IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_skus_client_status_ean ON public.skus(client_id, status, ean) WHERE ean IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_skus_client_status_fnsku ON public.skus(client_id, status, fnsku) WHERE fnsku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_skus_client_status_client_sku ON public.skus(client_id, status, client_sku);

-- ============================================
-- Blog Posts Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for published posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published, published_at DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage all blog posts"
  ON public.blog_posts
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Blog Images Storage Bucket
-- ============================================

-- Insert storage bucket for blog images (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog images
CREATE POLICY "Anyone can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));