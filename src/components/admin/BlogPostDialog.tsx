import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";
import { z } from "zod";
import { RichTextEditor } from "@/components/blog/RichTextEditor";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(200, "Slug too long").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().max(500, "Excerpt too long").optional(),
  content: z.string().optional(),
  published: z.boolean(),
});

interface BlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId?: string;
  onSuccess: () => void;
}

export const BlogPostDialog = ({ open, onOpenChange, postId, onSuccess }: BlogPostDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
    cover_image_url: "",
    category: "General" as string,
    tags: [] as string[],
    meta_description: "",
    author_bio: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open && postId) {
      loadPost();
    } else if (open && !postId) {
      resetForm();
    }
  }, [open, postId]);

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content || "",
        published: data.published,
        cover_image_url: data.cover_image_url || "",
        category: data.category || "General",
        tags: data.tags || [],
        meta_description: data.meta_description || "",
        author_bio: data.author_bio || "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load post",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      published: false,
      cover_image_url: "",
      category: "General",
      tags: [],
      meta_description: "",
      author_bio: "",
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, cover_image_url: publicUrl }));

      toast({
        title: "Image Uploaded",
        description: "Cover image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const validated = blogPostSchema.parse(formData);

      // Calculate read time
      const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      if (postId) {
        const { error } = await supabase
          .from("blog_posts")
          .update({
            ...validated,
            cover_image_url: formData.cover_image_url || null,
            published_at: validated.published ? new Date().toISOString() : null,
            category: formData.category,
            tags: formData.tags,
            meta_description: formData.meta_description || null,
            author_bio: formData.author_bio || null,
            read_time_minutes: readTime,
          })
          .eq("id", postId);

        if (error) throw error;

        toast({
          title: "Post Updated",
          description: "Blog post updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([{
            title: validated.title,
            slug: validated.slug,
            excerpt: validated.excerpt || null,
            content: validated.content || null,
            published: validated.published,
            cover_image_url: formData.cover_image_url || null,
            published_at: validated.published ? new Date().toISOString() : null,
            author_id: (await supabase.auth.getUser()).data.user?.id,
            category: formData.category,
            tags: formData.tags,
            meta_description: formData.meta_description || null,
            author_bio: formData.author_bio || null,
            read_time_minutes: readTime,
          }]);

        if (error) throw error;

        toast({
          title: "Post Created",
          description: "Blog post created successfully",
        });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to save post",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{postId ? "Edit Blog Post" : "Create Blog Post"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="url-friendly-slug"
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL: /blog/{formData.slug || "your-slug"}
            </p>
          </div>

          <div>
            <Label htmlFor="cover">Cover Image</Label>
            <div className="flex gap-2">
              <Input
                id="cover"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
            {formData.cover_image_url && (
              <img
                src={formData.cover_image_url}
                alt="Cover preview"
                className="mt-2 h-32 w-full object-cover rounded"
              />
            )}
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary (optional)"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="FBA Prep">FBA Prep</SelectItem>
                <SelectItem value="Shopify">Shopify</SelectItem>
                <SelectItem value="Multi-Channel">Multi-Channel</SelectItem>
                <SelectItem value="Industry News">Industry News</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags.join(", ")}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
              }))}
              placeholder="amazon fba, prep center, logistics"
            />
          </div>

          <div>
            <Label htmlFor="meta_description">
              Meta Description 
              <span className="text-xs text-muted-foreground ml-2">
                ({formData.meta_description.length}/155)
              </span>
            </Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => {
                if (e.target.value.length <= 155) {
                  setFormData(prev => ({ ...prev, meta_description: e.target.value }));
                }
              }}
              placeholder="Brief SEO description (max 155 characters)"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="author_bio">Author Bio (optional)</Label>
            <Textarea
              id="author_bio"
              value={formData.author_bio}
              onChange={(e) => setFormData(prev => ({ ...prev, author_bio: e.target.value }))}
              placeholder="Custom author bio for this post"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <div className="border rounded-lg overflow-hidden">
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
            />
            <Label htmlFor="published">
              {formData.published ? "Published" : "Draft"}
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {postId ? "Update" : "Create"} Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
