import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string;
  category: string | null;
}

interface RelatedPostsProps {
  currentPostId: string;
  category?: string | null;
}

const getCategoryGradient = (category?: string | null) => {
  const gradients = {
    '3PL-LOGISTICS': 'from-[hsl(220,80%,20%)] via-[hsl(220,70%,35%)] to-[hsl(180,60%,45%)]',
    'AMAZON FBA': 'from-[hsl(var(--blog-orange))] via-[hsl(25,90%,55%)] to-[hsl(15,85%,60%)]',
    'FULFILLMENT': 'from-[hsl(var(--blog-navy))] via-[hsl(220,75%,30%)] to-[hsl(220,70%,45%)]',
    '3PL & FULFILLMENT': 'from-[hsl(240,75%,25%)] via-[hsl(260,65%,40%)] to-[hsl(220,70%,50%)]',
    'PREP CENTER GUIDE': 'from-[hsl(280,70%,25%)] via-[hsl(280,60%,45%)] to-[hsl(320,65%,55%)]',
    'SHOPIFY': 'from-[hsl(150,70%,25%)] via-[hsl(150,60%,40%)] to-[hsl(150,55%,55%)]',
  };
  const key = category?.toUpperCase().replace(/\s+/g, '-');
  return gradients[key as keyof typeof gradients] || 'from-[hsl(215,25%,20%)] via-[hsl(215,20%,35%)] to-[hsl(215,20%,45%)]';
};

export const RelatedPosts = ({ currentPostId, category }: RelatedPostsProps) => {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedPosts();
  }, [currentPostId, category]);

  const fetchRelatedPosts = async () => {
    try {
      let query = supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, published_at, category")
        .eq("published", true)
        .neq("id", currentPostId)
        .order("published_at", { ascending: false })
        .limit(3);

      // Prefer posts in the same category
      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching related posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const gradient = getCategoryGradient(post.category);
              return (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-[hsl(var(--blog-orange))]">
                    {/* Gradient Header */}
                    <div className={`relative h-24 bg-gradient-to-br ${gradient} overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 10px,
                            rgba(255,255,255,0.1) 10px,
                            rgba(255,255,255,0.1) 20px
                          )`
                        }} />
                      </div>
                      {post.category && (
                        <div className="absolute top-3 left-4 backdrop-blur-md bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-white/30">
                          {post.category}
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-3 group-hover:text-[hsl(var(--blog-orange))] transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <time dateTime={post.published_at}>
                            {format(new Date(post.published_at), "MMM dd, yyyy")}
                          </time>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[hsl(var(--blog-orange))] transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
