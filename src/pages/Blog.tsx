import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Blog | Westfield Prep Center - Fulfillment Insights & Tips</title>
        <meta name="description" content="Read the latest insights, tips, and updates about e-commerce fulfillment, Amazon FBA prep, Shopify integration, and warehouse management from Westfield Prep Center." />
        <meta property="og:title" content="Blog | Westfield Prep Center" />
        <meta property="og:description" content="Expert insights on e-commerce fulfillment and warehouse management" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[{ label: "Blog", path: "/blog" }]} />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-24 mt-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-6 shadow-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Industry Insights & Resources</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Blog
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Expert insights, industry updates, and fulfillment strategies to grow your e-commerce business
                </p>
              </div>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden border-border/50">
                      <Skeleton className="h-56 w-full rounded-t-lg" />
                      <CardHeader>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full mb-4" />
                        <Skeleton className="h-4 w-24" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No Posts Yet</h3>
                  <p className="text-xl text-muted-foreground">Check back soon for expert insights and industry updates!</p>
                </div>
              ) : (
                <div className="max-w-7xl mx-auto">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                      <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                        <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50 overflow-hidden bg-background relative">
                          {idx === 0 && (
                            <div className="absolute top-4 right-4 z-10">
                              <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Latest
                              </div>
                            </div>
                          )}
                          {post.cover_image_url && (
                            <div className="overflow-hidden rounded-t-lg relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                              <img
                                src={post.cover_image_url}
                                alt={post.title}
                                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <CardHeader className="space-y-3">
                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl leading-tight">
                              {post.title}
                            </CardTitle>
                            {post.published_at && (
                              <CardDescription className="flex items-center gap-2 text-xs">
                                <Calendar className="h-3.5 w-3.5" />
                                {format(new Date(post.published_at), "MMMM dd, yyyy")}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                              {post.excerpt || "Click to read more about this topic..."}
                            </p>
                            <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all pt-2">
                              Read Article
                              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary" />
            <div className="absolute inset-0">
              <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="container mx-auto px-4 text-center relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Grow Your Business?</h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Partner with Westfield Prep Center for professional fulfillment services
              </p>
              <Link to="/contact">
                <button className="bg-white text-primary hover:bg-white/90 shadow-xl px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105">
                  Get a Free Quote
                </button>
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
