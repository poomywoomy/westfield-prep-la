-- Create RPC function to increment blog post view count
CREATE OR REPLACE FUNCTION increment_blog_view_count(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE blog_posts 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$;