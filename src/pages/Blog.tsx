import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { SearchBar } from "@/components/blog/SearchBar";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { BlogCard } from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  category?: string;
  author_name?: string;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, searchTerm]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
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

  const filterPosts = () => {
    let filtered = posts;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt?.toLowerCase().includes(term)
      );
    }
    setFilteredPosts(filtered);
  };

  return (
    <>
      <Helmet>
        <title>Prep Center Blog | E-Commerce Tips & Fulfillment Insights - Westfield</title>
        <meta name="description" content="Expert insights from our Los Angeles prep center. Learn about Amazon FBA prep, Shopify fulfillment, and e-commerce logistics best practices." />
        <link rel="canonical" href="https://westfieldprepcenter.com/blog" />
      </Helmet>
      <StructuredData type="collectionPage" data={{ posts: posts.slice(0, 10) }} />

      <Header />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(210 30% 12%), hsl(28 100% 50%))" }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[hsl(28,100%,50%)] text-white px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase">Industry Insights</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-6">Blog</h1>
            <div className="w-32 h-1 bg-[hsl(28,100%,50%)] mx-auto mb-6" />
            <p className="text-xl text-white/90">Expert fulfillment strategies, warehouse optimization tips, and logistics insights</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[hsl(210,20%,96%)]">
        <div className="container mx-auto px-4"><NewsletterSignup /></div>
      </section>

      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[hsl(210,30%,12%)]">{selectedCategory === "All" ? "All Articles" : selectedCategory}</h2>
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4 min-h-[400px]">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Articles Found</h3>
            </div>
          ) : (
            <>
              {/* Featured Post - Full Width */}
              {filteredPosts.length > 0 && (
                <div className="mb-12">
                  <BlogCard
                    key={filteredPosts[0].id}
                    id={filteredPosts[0].id}
                    title={filteredPosts[0].title}
                    slug={filteredPosts[0].slug}
                    excerpt={filteredPosts[0].excerpt || ""}
                    publishedAt={filteredPosts[0].published_at}
                    category={filteredPosts[0].category}
                    authorName={filteredPosts[0].author_name}
                    isFeatured={true}
                  />
                </div>
              )}

              {/* Regular Posts Grid with Variants */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(1).map((post, index) => {
                  const variants = ['standard', 'accent-border', 'side-accent'] as const;
                  const variant = variants[index % 3];
                  
                  return (
                    <BlogCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      slug={post.slug}
                      excerpt={post.excerpt || ""}
                      publishedAt={post.published_at}
                      category={post.category}
                      authorName={post.author_name}
                      variant={variant}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-[hsl(210,30%,12%)] border-t-4 border-[hsl(28,100%,50%)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Optimize Your Fulfillment?</h2>
          <Button onClick={() => (window.location.href = "/contact")} className="bg-[hsl(28,100%,50%)] hover:bg-[hsl(28,100%,45%)] text-white px-8 py-6 text-lg">Get Started Today</Button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Blog;
