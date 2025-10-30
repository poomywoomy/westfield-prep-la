import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogPostRenderer } from "@/components/blog/BlogPostRenderer";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const BlogEditorTab = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  
  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };
  
  const handleSaveDraft = async () => {
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('blog_posts').insert({
        title,
        slug: slug || generateSlug(title),
        excerpt: excerpt || null,
        content,
        category: category || null,
        meta_description: metaDescription || null,
        tags: tags ? tags.split(',').map(t => t.trim()) : null,
        cover_image_url: coverImageUrl || null,
        published: false,
        read_time_minutes: calculateReadTime(content),
        author_name: 'Westfield Prep Team',
        author_bio: 'Expert team at Westfield Prep Center with years of experience in e-commerce fulfillment.',
      });
      
      if (error) throw error;
      toast.success('Draft saved successfully!');
      resetForm();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePublish = async () => {
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('blog_posts').insert({
        title,
        slug: slug || generateSlug(title),
        excerpt: excerpt || null,
        content,
        category: category || null,
        meta_description: metaDescription || null,
        tags: tags ? tags.split(',').map(t => t.trim()) : null,
        cover_image_url: coverImageUrl || null,
        published: true,
        published_at: new Date().toISOString(),
        read_time_minutes: calculateReadTime(content),
        author_name: 'Westfield Prep Team',
        author_bio: 'Expert team at Westfield Prep Center with years of experience in e-commerce fulfillment.',
      });
      
      if (error) throw error;
      toast.success('Post published successfully!');
      resetForm();
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategory('');
    setMetaDescription('');
    setTags('');
    setCoverImageUrl('');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Blog Post Editor</h2>
        <div className="flex gap-2">
          <Button onClick={handleSaveDraft} variant="outline" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Draft
          </Button>
          <Button onClick={handlePublish} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Publish Post
          </Button>
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) setSlug(generateSlug(e.target.value));
                }}
                placeholder="Post title"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input 
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="post-url-slug"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea 
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content (Markdown) *</Label>
            <Textarea 
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post in markdown...&#10;&#10;# Main Heading&#10;## Subheading&#10;&#10;Your content here..."
              rows={20}
              className="font-mono"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Estimated read time: {calculateReadTime(content)} min
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Shopify Fulfillment"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input 
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="shopify, 3pl, fulfillment"
              />
            </div>
            <div>
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input 
                id="coverImage"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
            <Textarea 
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO description (max 160 characters)..."
              rows={2}
              maxLength={160}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {metaDescription.length}/160 characters
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="border rounded-lg p-6 mt-4 bg-background">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{title || 'Untitled Post'}</h1>
          {excerpt && (
            <div className="mb-6 p-4 bg-muted rounded-lg italic">
              {excerpt}
            </div>
          )}
          <BlogPostRenderer content={content} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
