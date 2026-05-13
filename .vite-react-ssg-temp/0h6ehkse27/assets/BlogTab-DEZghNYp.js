import { jsxs, jsx } from "react/jsx-runtime";
import { useCallback, useState, useEffect } from "react";
import { B as Button, l as useToast, s as supabase, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, C as DialogFooter } from "../main.mjs";
import { Undo, Redo, Bold, Italic, Underline as Underline$1, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, Link as Link$1, Image as Image$1, Table as Table$1, Loader2, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { C as Card, b as CardHeader, a as CardContent, c as CardTitle, d as CardDescription } from "./card-WfKgKW48.js";
import { B as Badge } from "./badge-BbLwm7hH.js";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { T as Textarea, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { a as Switch } from "./SKUFormDialog-D171tANM.js";
import { z } from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { S as Separator } from "./AdminDashboard-DxDl1gMW.js";
import { format } from "date-fns";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D7ZcK1Wa.js";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "framer-motion";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-switch";
import "./tabs-DOpNgkQL.js";
import "@radix-ui/react-tabs";
import "@radix-ui/react-separator";
import "./skeleton-6MvOnm4j.js";
import "./ASNFormDialog-B0PvkEvQ.js";
import "html5-qrcode";
import "@radix-ui/react-alert-dialog";
const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: "Start writing your blog post..." })
    ],
    content,
    onUpdate: ({ editor: editor2 }) => {
      onChange(editor2.getHTML());
    }
  });
  const addImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);
  const addLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);
  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);
  if (!editor) return null;
  return /* @__PURE__ */ jsxs("div", { className: "border-2 border-[hsl(var(--blog-navy))] rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-[hsl(var(--blog-navy))] p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().undo().run(),
          disabled: !editor.can().undo(),
          className: "text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white",
          children: /* @__PURE__ */ jsx(Undo, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().redo().run(),
          disabled: !editor.can().redo(),
          className: "text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white",
          children: /* @__PURE__ */ jsx(Redo, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 bg-white/20" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleBold().run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("bold") ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(Bold, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleItalic().run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("italic") ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(Italic, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("underline") ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(Underline$1, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleStrike().run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("strike") ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(Strikethrough, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 bg-white/20" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("heading", { level: 1 }) ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(Heading1, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("heading", { level: 2 }) ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(Heading2, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("heading", { level: 3 }) ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(Heading3, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 bg-white/20" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("bulletList") ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(List, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("orderedList") ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(ListOrdered, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("blockquote") ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(Quote, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 bg-white/20" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().setTextAlign("left").run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive({ textAlign: "left" }) ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(AlignLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().setTextAlign("center").run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive({ textAlign: "center" }) ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(AlignCenter, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => editor.chain().focus().setTextAlign("right").run(),
          className: `text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive({ textAlign: "right" }) ? "bg-[hsl(var(--blog-orange))]" : ""}`,
          children: /* @__PURE__ */ jsx(AlignRight, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 bg-white/20" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: addLink,
          className: "text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white",
          children: /* @__PURE__ */ jsx(Link$1, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: addImage,
          className: "text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white",
          children: /* @__PURE__ */ jsx(Image$1, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: addTable,
          className: "text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white",
          children: /* @__PURE__ */ jsx(Table$1, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      EditorContent,
      {
        editor,
        className: "prose prose-sm max-w-none p-6 min-h-[500px] focus:outline-none\n          [&_.ProseMirror]:outline-none\n          [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[hsl(var(--blog-gray-blue))]\n          [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]\n          [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left\n          [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0\n          [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none\n        "
      }
    )
  ] });
};
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(200, "Slug too long").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().max(500, "Excerpt too long").optional(),
  content: z.string().optional(),
  published: z.boolean()
});
const BlogPostDialog = ({ open, onOpenChange, postId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
    cover_image_url: "",
    category: "General",
    tags: [],
    meta_description: "",
    author_bio: ""
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
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", postId).single();
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
        author_bio: data.author_bio || ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load post",
        variant: "destructive"
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
      author_bio: ""
    });
  };
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  };
  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from("blog-images").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, cover_image_url: publicUrl }));
      toast({
        title: "Image Uploaded",
        description: "Cover image uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const validated = blogPostSchema.parse(formData);
      const wordCount = formData.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      if (postId) {
        const { error } = await supabase.from("blog_posts").update({
          ...validated,
          cover_image_url: formData.cover_image_url || null,
          published_at: validated.published ? (/* @__PURE__ */ new Date()).toISOString() : null,
          category: formData.category,
          tags: formData.tags,
          meta_description: formData.meta_description || null,
          author_bio: formData.author_bio || null,
          read_time_minutes: readTime
        }).eq("id", postId);
        if (error) throw error;
        toast({
          title: "Post Updated",
          description: "Blog post updated successfully"
        });
      } else {
        const { error } = await supabase.from("blog_posts").insert([{
          title: validated.title,
          slug: validated.slug,
          excerpt: validated.excerpt || null,
          content: validated.content || null,
          published: validated.published,
          cover_image_url: formData.cover_image_url || null,
          published_at: validated.published ? (/* @__PURE__ */ new Date()).toISOString() : null,
          author_id: (await supabase.auth.getUser()).data.user?.id,
          category: formData.category,
          tags: formData.tags,
          meta_description: formData.meta_description || null,
          author_bio: formData.author_bio || null,
          read_time_minutes: readTime
        }]);
        if (error) throw error;
        toast({
          title: "Post Created",
          description: "Blog post created successfully"
        });
      }
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to save post",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: postId ? "Edit Blog Post" : "Create Blog Post" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Title *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "title",
            value: formData.title,
            onChange: (e) => handleTitleChange(e.target.value),
            placeholder: "Enter post title"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "slug", children: "Slug *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "slug",
            value: formData.slug,
            onChange: (e) => setFormData((prev) => ({ ...prev, slug: e.target.value })),
            placeholder: "url-friendly-slug"
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "URL: /blog/",
          formData.slug || "your-slug"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "cover", children: "Cover Image" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "cover",
              type: "file",
              accept: "image/*",
              onChange: handleImageUpload,
              disabled: uploading
            }
          ),
          uploading && /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" })
        ] }),
        formData.cover_image_url && /* @__PURE__ */ jsx(
          "img",
          {
            src: formData.cover_image_url,
            alt: "Cover preview",
            className: "mt-2 h-32 w-full object-cover rounded"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "excerpt", children: "Excerpt" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "excerpt",
            value: formData.excerpt,
            onChange: (e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value })),
            placeholder: "Brief summary (optional)",
            rows: 2
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "category", children: "Category" }),
        /* @__PURE__ */ jsxs(Select, { value: formData.category, onValueChange: (value) => setFormData((prev) => ({ ...prev, category: value })), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select category" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "General", children: "General" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "FBA Prep", children: "FBA Prep" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Shopify", children: "Shopify" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Multi-Channel", children: "Multi-Channel" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Industry News", children: "Industry News" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "tags", children: "Tags (comma-separated)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "tags",
            value: formData.tags.join(", "),
            onChange: (e) => setFormData((prev) => ({
              ...prev,
              tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
            })),
            placeholder: "amazon fba, prep center, logistics"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "meta_description", children: [
          "Meta Description",
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: [
            "(",
            formData.meta_description.length,
            "/155)"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "meta_description",
            value: formData.meta_description,
            onChange: (e) => {
              if (e.target.value.length <= 155) {
                setFormData((prev) => ({ ...prev, meta_description: e.target.value }));
              }
            },
            placeholder: "Brief SEO description (max 155 characters)",
            rows: 2
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "author_bio", children: "Author Bio (optional)" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "author_bio",
            value: formData.author_bio,
            onChange: (e) => setFormData((prev) => ({ ...prev, author_bio: e.target.value })),
            placeholder: "Custom author bio for this post",
            rows: 2
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "content", children: "Content *" }),
        /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsx(
          RichTextEditor,
          {
            content: formData.content,
            onChange: (html) => setFormData((prev) => ({ ...prev, content: html }))
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          Switch,
          {
            id: "published",
            checked: formData.published,
            onCheckedChange: (checked) => setFormData((prev) => ({ ...prev, published: checked }))
          }
        ),
        /* @__PURE__ */ jsx(Label, { htmlFor: "published", children: formData.published ? "Published" : "Draft" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxs(Button, { onClick: handleSubmit, disabled: loading, children: [
        loading ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
        postId ? "Update" : "Create",
        " Post"
      ] })
    ] })
  ] }) });
};
const BlogTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPost, setEditingPost] = useState();
  const [deletePost, setDeletePost] = useState(null);
  const { toast } = useToast();
  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from("blog_posts").select("id, title, slug, excerpt, published, published_at, cover_image_url, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch blog posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!deletePost) return;
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", deletePost);
      if (error) throw error;
      toast({
        title: "Post Deleted",
        description: "Blog post has been deleted successfully"
      });
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive"
      });
    } finally {
      setDeletePost(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold", children: "Blog Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Create and manage blog posts for the public site" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => {
        setEditingPost(void 0);
        setShowDialog(true);
      }, children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "New Post"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsxs(Card, { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-48 bg-muted" }),
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 bg-muted rounded mb-2" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-2/3" })
      ] })
    ] }, i)) }) : posts.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg mb-4", children: "No blog posts yet" }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => setShowDialog(true), children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Create Your First Post"
      ] })
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: posts.map((post) => /* @__PURE__ */ jsxs(Card, { className: "group hover:shadow-lg transition-shadow", children: [
      post.cover_image_url && /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-t-lg", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: post.cover_image_url,
          alt: post.title,
          className: "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        }
      ) }),
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "line-clamp-2", children: post.title }),
          /* @__PURE__ */ jsx(Badge, { variant: post.published ? "default" : "secondary", children: post.published ? "Published" : "Draft" })
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: post.published_at ? format(new Date(post.published_at), "MMM dd, yyyy") : format(new Date(post.created_at), "MMM dd, yyyy") })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground line-clamp-2 mb-4", children: post.excerpt || "No excerpt" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => window.open(`/blog/${post.slug}`, "_blank"),
              children: [
                /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-1" }),
                "View"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                setEditingPost(post.id);
                setShowDialog(true);
              },
              children: [
                /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4 mr-1" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setDeletePost(post.id),
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-1" }),
                "Delete"
              ]
            }
          )
        ] })
      ] })
    ] }, post.id)) }),
    /* @__PURE__ */ jsx(
      BlogPostDialog,
      {
        open: showDialog,
        onOpenChange: setShowDialog,
        postId: editingPost,
        onSuccess: fetchPosts
      }
    ),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deletePost, onOpenChange: () => setDeletePost(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Blog Post" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure you want to delete this blog post? This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleDelete, children: "Delete" })
      ] })
    ] }) })
  ] });
};
export {
  BlogTab
};
