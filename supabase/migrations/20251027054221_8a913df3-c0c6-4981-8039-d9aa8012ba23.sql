-- Add new fields to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS author_bio TEXT DEFAULT 'Expert team at Westfield Prep Center with years of experience in e-commerce fulfillment, Amazon FBA prep, and Shopify logistics.',
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published, published_at DESC);

-- Update existing posts with default category
UPDATE public.blog_posts 
SET category = 'General'
WHERE category IS NULL;

COMMENT ON COLUMN public.blog_posts.category IS 'Blog post category: FBA Prep, Shopify, Multi-Channel, General';
COMMENT ON COLUMN public.blog_posts.tags IS 'Array of tags for better organization and filtering';
COMMENT ON COLUMN public.blog_posts.meta_description IS 'SEO meta description (max 155 characters)';
COMMENT ON COLUMN public.blog_posts.author_bio IS 'Author bio text displayed at bottom of post';
COMMENT ON COLUMN public.blog_posts.view_count IS 'Number of times the post has been viewed';