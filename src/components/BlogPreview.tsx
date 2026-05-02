import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TranslatedText } from "@/components/TranslatedText";
import { SectionHeading } from "./home/HomePrimitives";
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

  if (!isLoading && (!posts || posts.length === 0)) return null;

  return (
    <section className="relative py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Insights"
            title={<TranslatedText>E-Commerce Insights & Resources</TranslatedText>}
            subtitle={<TranslatedText>Expert guidance on 3PL logistics, fulfillment optimization, and scaling your online business.</TranslatedText>}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden bg-background border-border">
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
                  <div
                    key={article.id}
                    onClick={() => navigate(`/blog/${article.slug}`)}
                    className="group cursor-pointer overflow-hidden rounded-2xl bg-background border border-border shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-secondary/40 transition-all"
                  >
                    <div className="aspect-video bg-muted overflow-hidden">
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
                        <div className="w-full h-full flex items-center justify-center text-6xl text-secondary/30">📦</div>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      {article.category && (
                        <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/10 border-0 font-bold text-[10px] uppercase tracking-widest">
                          <TranslatedText>{article.category}</TranslatedText>
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors tracking-tight">
                        <TranslatedText>{article.title}</TranslatedText>
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <TranslatedText>{article.excerpt}</TranslatedText>
                        </p>
                      )}
                      <div className="flex items-center text-secondary font-bold text-sm pt-2">
                        <TranslatedText>Read More</TranslatedText>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground font-bold transition-colors"
            >
              <TranslatedText>View All Articles</TranslatedText>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
