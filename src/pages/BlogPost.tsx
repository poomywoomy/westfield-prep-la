import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  author_id: string | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const estimatedReadTime = Math.max(1, Math.ceil((post.content?.split(' ').length || 0) / 200));

  return (
    <>
      <Helmet>
        <title>{post.title} | Westfield Prep Center Blog</title>
        <meta name="description" content={post.excerpt || `Read ${post.title} on Westfield Prep Center blog`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <meta property="og:type" content="article" />
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[
          { label: "Blog", path: "/blog" },
          { label: post.title, path: `/blog/${post.slug}` }
        ]} />

        <article className="flex-1">
          {/* Hero Section with Cover Image */}
          <section className="relative pt-16 pb-12 overflow-hidden">
            {post.cover_image_url ? (
              <>
                <div className="absolute inset-0">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
                </div>
                <div className="container mx-auto px-4 relative pt-20 pb-16">
                  <div className="max-w-4xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors group">
                      <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      Back to Blog
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                      {post.published_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={post.published_at} className="text-sm">
                            {format(new Date(post.published_at), "MMMM dd, yyyy")}
                          </time>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{estimatedReadTime} min read</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: post.title, url: window.location.href });
                          }
                        }}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="container mx-auto px-4 pt-8">
                <div className="max-w-4xl mx-auto">
                  <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                  </Link>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-muted-foreground">
                    {post.published_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.published_at} className="text-sm">
                          {format(new Date(post.published_at), "MMMM dd, yyyy")}
                        </time>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{estimatedReadTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Content Section */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                {post.excerpt && (
                  <div className="mb-12 p-6 bg-muted/50 border-l-4 border-primary rounded-r-lg">
                    <p className="text-lg md:text-xl text-foreground italic leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground">
                  {post.content?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Share Section */}
                <div className="mt-16 pt-8 border-t">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <Link to="/blog">
                      <Button variant="outline" size="lg" className="group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to All Posts
                      </Button>
                    </Link>
                    <Button 
                      variant="default"
                      size="lg"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: post.title, url: window.location.href });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Article
                    </Button>
                  </div>
                </div>
              </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Scale Your Business?</h2>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Partner with Westfield Prep Center for professional fulfillment services
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
                  Get a Free Quote
                </Button>
              </Link>
            </div>
          </section>
        </article>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
