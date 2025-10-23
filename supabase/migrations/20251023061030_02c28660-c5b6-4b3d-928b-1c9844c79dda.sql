-- Add new columns to blog_posts table for enhanced functionality
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Westfield Team',
ADD COLUMN IF NOT EXISTS read_time_minutes INTEGER,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING gin(tags) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING gin(
  to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, ''))
) WHERE published = true;

-- Add comment for documentation
COMMENT ON COLUMN blog_posts.category IS 'Blog post category (Fulfillment, Inventory, Supply Chain, etc.)';
COMMENT ON COLUMN blog_posts.author_name IS 'Name of the article author';
COMMENT ON COLUMN blog_posts.read_time_minutes IS 'Estimated reading time in minutes';
COMMENT ON COLUMN blog_posts.meta_description IS 'SEO meta description for search engines';
COMMENT ON COLUMN blog_posts.tags IS 'Array of tags for content organization and filtering';