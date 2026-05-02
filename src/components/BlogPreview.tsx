import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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

const formatDate = (s: string | null) => {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

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

  const featured = posts?.[0];
  const sidePosts = posts?.slice(1, 3) ?? [];

  return (
    <section className="relative py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Magazine-style heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-secondary">
                The Westfield Journal
              </span>
              <h2 className="mt-3 text-4xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight">
                <TranslatedText>Insights &</TranslatedText>{" "}
                <span className="font-display italic font-normal text-secondary">
                  <TranslatedText>resources.</TranslatedText>
                </span>
              </h2>
            </div>
            <button
              onClick={() => navigate("/blog")}
              className="hidden md:inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all"
            >
              <TranslatedText>View all articles</TranslatedText>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid lg:grid-cols-12 gap-8">
              <Card className="lg:col-span-7 overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-7 space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </Card>
              <div className="lg:col-span-5 space-y-6">
                {[0, 1].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="grid grid-cols-[140px_1fr] gap-0">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-5 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
              {/* FEATURED large post */}
              {featured && (
                <article
                  onClick={() => navigate(`/blog/${featured.slug}`)}
                  className="lg:col-span-7 group cursor-pointer rounded-3xl overflow-hidden bg-background border border-border hover:border-secondary/40 hover:shadow-2xl transition-all"
                >
                  <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                    {featured.cover_image_url ? (
                      <img
                        src={getOptimizedImageUrl(featured.cover_image_url)}
                        srcSet={getResponsiveSrcSet(featured.cover_image_url)}
                        sizes={getBlogImageSizes("card")}
                        alt={featured.title}
                        width={1200}
                        height={750}
                        loading="lazy"
                        decoding="async"
                        onError={buildWebpFallbackOnError(featured.cover_image_url)}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl text-secondary/30">📦</div>
                    )}
                    {/* Featured badge */}
                    <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-[0.18em]">
                      <TranslatedText>Featured</TranslatedText>
                    </div>
                  </div>
                  <div className="p-7 md:p-9">
                    <div className="flex items-center gap-3 mb-4">
                      {featured.category && (
                        <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/10 border-0 font-bold text-[10px] uppercase tracking-widest">
                          <TranslatedText>{featured.category}</TranslatedText>
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(featured.published_at)}</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-primary group-hover:text-secondary transition-colors tracking-tight leading-tight">
                      <TranslatedText>{featured.title}</TranslatedText>
                    </h3>
                    {featured.excerpt && (
                      <p className="mt-4 text-base text-muted-foreground leading-relaxed line-clamp-2">
                        <TranslatedText>{featured.excerpt}</TranslatedText>
                      </p>
                    )}
                    <div className="mt-6 flex items-center text-secondary font-bold">
                      <TranslatedText>Read article</TranslatedText>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              )}

              {/* SIDE posts — horizontal cards */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {sidePosts.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => navigate(`/blog/${article.slug}`)}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-background border border-border hover:border-secondary/40 hover:shadow-lg transition-all flex-1 min-h-[180px]"
                  >
                    <div className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] h-full">
                      <div className="relative bg-muted overflow-hidden">
                        {article.cover_image_url ? (
                          <img
                            src={getOptimizedImageUrl(article.cover_image_url)}
                            alt={article.title}
                            width={400}
                            height={400}
                            loading="lazy"
                            decoding="async"
                            onError={buildWebpFallbackOnError(article.cover_image_url)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl text-secondary/30">📦</div>
                        )}
                      </div>
                      <div className="p-5 md:p-6 flex flex-col justify-between">
                        <div>
                          {article.category && (
                            <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/10 border-0 font-bold text-[9px] uppercase tracking-widest mb-2">
                              <TranslatedText>{article.category}</TranslatedText>
                            </Badge>
                          )}
                          <h3 className="text-base md:text-lg font-bold text-primary group-hover:text-secondary transition-colors tracking-tight leading-snug line-clamp-3">
                            <TranslatedText>{article.title}</TranslatedText>
                          </h3>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                          <span>{formatDate(article.published_at)}</span>
                          <ArrowUpRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground font-bold transition-colors"
            >
              <TranslatedText>View all articles</TranslatedText>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
