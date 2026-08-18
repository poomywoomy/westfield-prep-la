import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  author_id: string | null;
  author_name: string | null;
  author_bio: string | null;
  category: string | null;
  meta_description: string | null;
  read_time_minutes: number | null;
  created_at?: string;
  tags?: string[] | null;
}

export async function fetchBlogPost(slug: string): Promise<BlogPostRecord | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
  return (data as BlogPostRecord | null) ?? null;
}

export const blogPostQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPost(slug),
    staleTime: 60_000,
  });

export async function fetchBlogPosts(): Promise<BlogPostRecord[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
  return (data as BlogPostRecord[]) ?? [];
}

export const blogPostsQueryOptions = () =>
  queryOptions({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    staleTime: 60_000,
  });
