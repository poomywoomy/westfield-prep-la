import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TranslatedText } from "@/components/TranslatedText";
import {
  getOptimizedImageUrl,
  getResponsiveSrcSet,
  getBlogImageSizes,
  buildWebpFallbackOnError,
} from "@/lib/imageOptimization";

interface LatestPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_image_url: string | null;
  published_at: string | null;
}

const BlogPreview = () => {
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["latest-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, cover_image_url, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return (data ?? []) as LatestPost[];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Hide section entirely if no posts yet
  if (!isLoading && (!posts || posts.length === 0)) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <TranslatedText>E-Commerce Insights & Resources</TranslatedText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <TranslatedText>Expert guidance on 3PL logistics, fulfillment optimization, and scaling your online business.</TranslatedText>
            </p>
          </div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden bg-card">
                    <Skeleton className="aspect-video w-full rounded-none" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </Card>
                ))
              : posts!.map((article) => (
                  <Card
                    key={article.id}
                    className="group cursor-pointer overflow-hidden bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    onClick={() => navigate(`/blog/${article.slug}`)}
                  >
                    {/* Cover Image */}
                    <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 overflow-hidden">
                      {article.cover_image_url ? (
                        <img
                          src={getOptimizedImageUrl(article.cover_image_url)}
                          srcSet={getResponsiveSrcSet(article.cover_image_url)}
                          sizes={getBlogImageSizes("card")}
                          alt={article.title}
                          width={800}
                          height={450}
                          loading="lazy"
                          decoding="async"
                          onError={buildWebpFallbackOnError(article.cover_image_url)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <div className="text-6xl text-primary/20">📦</div>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      {article.category && (
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                          <TranslatedText>{article.category}</TranslatedText>
                        </Badge>
                      )}

                      <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors duration-200">
                        <TranslatedText>{article.title}</TranslatedText>
                      </h3>

                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <TranslatedText>{article.excerpt}</TranslatedText>
                        </p>
                      )}

                      <div className="flex items-center text-secondary font-semibold text-sm pt-2">
                        <TranslatedText>Read More</TranslatedText>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
