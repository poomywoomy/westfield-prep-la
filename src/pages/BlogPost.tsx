import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { BlogPostRenderer } from "@/components/blog/BlogPostRenderer";
import { BlogPostSchema } from "@/components/blog/BlogPostSchema";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { ShareButtons } from "@/components/blog/ShareButtons";

// Blog post page component
interface BlogPost {
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

  // Track view count
  useEffect(() => {
    if (post?.id) {
      const incrementViewCount = async () => {
        try {
          await supabase.rpc('increment_blog_view_count' as any, { post_id: post.id });
        } catch (error) {
          console.error('Error incrementing view count:', error);
        }
      };
      incrementViewCount();
    }
  }, [post?.id]);

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

  

  return (
    <>
      <Helmet>
        <title>
          {post.slug === 'shopify-3pl-los-angeles' 
            ? 'Shopify 3PL Los Angeles | Fast Shopify Fulfillment Center - Westfield'
            : `${post.title} | Westfield Prep Center Blog`
          }
        </title>
        <meta name="description" content={post.meta_description || post.excerpt || `Read ${post.title} on Westfield Prep Center blog`} />
        <link rel="canonical" href={`https://westfieldprepcenter.com/blog/${post.slug}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={
          post.slug === 'shopify-3pl-los-angeles'
            ? 'Shopify 3PL Los Angeles | Fast Fulfillment Center - Westfield'
            : post.title
        } />
        <meta property="og:description" content={
          post.slug === 'shopify-3pl-los-angeles'
            ? 'Westfield is a Shopify-native 3PL in Los Angeles offering fast, accurate fulfillment, real-time syncing, and same-day receiving for growing Shopify brands.'
            : (post.meta_description || post.excerpt || "")
        } />
        <meta property="og:url" content={`https://westfieldprepcenter.com/blog/${post.slug}`} />
        {post.slug === 'shopify-3pl-los-angeles' ? (
          <meta property="og:image" content="https://westfieldprepcenter.com/images/shopify-3pl-la.jpg" />
        ) : post.cover_image_url ? (
          <meta property="og:image" content={post.cover_image_url.startsWith('http') ? post.cover_image_url : `${window.location.origin}${post.cover_image_url}`} />
        ) : null}
        <meta property="og:type" content="article" />
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
        {post.category && <meta property="article:section" content={post.category} />}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={
          post.slug === 'shopify-3pl-los-angeles'
            ? 'Shopify 3PL Los Angeles | Fast Fulfillment Center - Westfield'
            : post.title
        } />
        <meta name="twitter:description" content={
          post.slug === 'shopify-3pl-los-angeles'
            ? 'Westfield is a Shopify-native 3PL in Los Angeles offering fast, accurate fulfillment, real-time syncing, and same-day receiving for growing Shopify brands.'
            : (post.meta_description || post.excerpt || `Read ${post.title} on Westfield Prep Center blog`)
        } />
        {post.slug === 'shopify-3pl-los-angeles' ? (
          <meta name="twitter:image" content="https://westfieldprepcenter.com/images/shopify-3pl-la.jpg" />
        ) : post.cover_image_url ? (
          <meta name="twitter:image" content={post.cover_image_url.startsWith('http') ? post.cover_image_url : `${window.location.origin}${post.cover_image_url}`} />
        ) : null}
      </Helmet>

      {/* Enhanced 2025-compliant JSON-LD Schema for Google Rich Results */}
      <BlogPostSchema
        title={post.title}
        excerpt={post.meta_description || post.excerpt || ""}
        content={post.content || ""}
        coverImageUrl={post.cover_image_url || undefined}
        authorName={post.author_name || "Westfield Team"}
        authorBio={post.author_bio || "Expert team at Westfield Prep Center with years of experience in e-commerce fulfillment."}
        publishedAt={post.published_at || new Date().toISOString()}
        updatedAt={post.published_at || new Date().toISOString()}
        category={post.category || "Fulfillment"}
        tags={(post as any).tags || []}
        slug={post.slug}
      />

      <StructuredData type="breadcrumb" data={[
        { name: "Home", url: "https://westfieldprepcenter.com/" },
        { name: "Blog", url: "https://westfieldprepcenter.com/blog/" },
        { name: post.title, url: `https://westfieldprepcenter.com/blog/${post.slug}` }
      ]} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs items={[
          { label: "Blog", path: "/blog" },
          { label: post.title, path: `/blog/${post.slug}` }
        ]} />

        <article className="flex-1">
          {/* Hero Section with Cover Image */}
          <section className="relative min-h-[420px] md:min-h-[520px] overflow-hidden">
            {post.cover_image_url ? (
              <>
                <div className="absolute inset-0">
                  <img
                    src={post.cover_image_url}
                    alt={`${post.title} - Westfield Prep Center blog cover image`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "/hero-warehouse-optimized.webp"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
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
                      <ShareButtons
                        title={post.title}
                        variant="ghost"
                        size="sm"
                      />
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
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Content Section */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-8">
                    {post.excerpt && (
                      <div className="mb-12 p-6 bg-muted/50 border-l-4 border-primary rounded-r-lg">
                        <p className="text-lg md:text-xl text-foreground italic leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    )}

                    {post.category && (
                      <div className="mb-6">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                          {post.category}
                        </span>
                      </div>
                    )}

                    <BlogPostRenderer content={post.content || ""} />

                    {/* Author Bio */}
                    <AuthorBio 
                      authorName={post.author_name || undefined}
                      authorBio={post.author_bio || undefined}
                    />

                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <Link to="/blog">
                          <Button variant="outline" size="lg" className="group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to All Posts
                          </Button>
                        </Link>
                        <ShareButtons 
                          title={post.title}
                          variant="default"
                          size="lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sidebar with Table of Contents */}
                  <aside className="lg:col-span-4">
                    <TableOfContents content={post.content || ""} />
                  </aside>
                </div>
              </div>
            </div>
          </section>

          {/* Related Posts */}
          <RelatedPosts currentPostId={post.id} category={post.category} />

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
