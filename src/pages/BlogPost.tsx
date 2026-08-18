import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogPostQueryOptions } from "@/lib/blogPostQuery";
import { useParams, useNavigate, Link } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { BlogPostRenderer } from "@/components/blog/BlogPostRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { parseMarkdown } from "@/lib/markdownParser";
import { TranslatedText } from "@/components/TranslatedText";
import {
  getOptimizedImageUrl,
  getResponsiveSrcSet,
  getBlogImageSizes,
  buildWebpFallbackOnError,
} from "@/lib/imageOptimization";

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
  const { data: post = null, isLoading: loading, isError } = useQuery({
    ...blogPostQueryOptions(slug ?? ""),
    enabled: Boolean(slug),
  });
  const htmlContent = post?.content ? parseMarkdown(post.content) : "";

  useEffect(() => {
    if (!loading && (isError || (slug && post === null))) {
      navigate("/blog");
    }
  }, [loading, isError, post, slug, navigate]);


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


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground"><TranslatedText>Loading article...</TranslatedText></p>
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
                    src={getOptimizedImageUrl(post.cover_image_url) || post.cover_image_url}
                    srcSet={getResponsiveSrcSet(post.cover_image_url)}
                    sizes={getBlogImageSizes("hero")}
                    alt={`${post.title} - Westfield Prep Center blog cover image`}
                    width={1600}
                    height={900}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    // @ts-expect-error - lowercase fetchpriority is the correct HTML attribute
                    fetchpriority="high"
                    onError={(e) => {
                      const fallback = buildWebpFallbackOnError(post.cover_image_url);
                      if (fallback) {
                        fallback(e);
                      } else {
                        e.currentTarget.src = "/hero-warehouse-optimized.webp";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
                </div>
                <div className="container mx-auto px-4 relative pt-20 pb-16">
                  <div className="max-w-4xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors group">
                      <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      <TranslatedText>Back to Blog</TranslatedText>
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                      {(() => {
                        const slugDates: Record<string, { dateTime: string; display: string }> = {
                          'how-fulfillment-center-los-angeles-california-supports-business-growth': {
                            dateTime: '2026-08-12',
                            display: 'August 12, 2026'
                          }
                        };
                        const override = slugDates[post.slug];
                        const dateTime = override?.dateTime || post.published_at;
                        const display = override?.display || (post.published_at ? format(new Date(post.published_at), "MMMM dd, yyyy") : null);
                        return dateTime && display ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={dateTime} className="text-sm">
                              {display}
                            </time>
                          </div>
                        ) : null;
                      })()}
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
                    <TranslatedText>Back to Blog</TranslatedText>
                  </Link>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-muted-foreground">
                    {(() => {
                      const slugDates: Record<string, { dateTime: string; display: string }> = {
                        'how-fulfillment-center-los-angeles-california-supports-business-growth': {
                          dateTime: '2026-08-12',
                          display: 'August 12, 2026'
                        }
                      };
                      const override = slugDates[post.slug];
                      const dateTime = override?.dateTime || post.published_at;
                      const display = override?.display || (post.published_at ? format(new Date(post.published_at), "MMMM dd, yyyy") : null);
                      return dateTime && display ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={dateTime} className="text-sm">
                            {display}
                          </time>
                        </div>
                      ) : null;
                    })()}
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

                    <BlogPostRenderer content={htmlContent} />

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
                            <TranslatedText>Back to All Posts</TranslatedText>
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
                    <TableOfContents content={htmlContent} />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white"><TranslatedText>Ready to Scale Your Business?</TranslatedText></h2>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                <TranslatedText>Partner with Westfield Prep Center for professional fulfillment services</TranslatedText>
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
                  <TranslatedText>Get a Free Quote</TranslatedText>
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
