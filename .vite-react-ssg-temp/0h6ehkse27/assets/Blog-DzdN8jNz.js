import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { B as Button, l as useToast, s as supabase, S as StructuredData, H as Header, T as TranslatedText, F as Footer } from "../main.mjs";
import { Search, Mail, Calendar, ArrowRight, TrendingUp, MoveRight, BookOpen } from "lucide-react";
import { I as Input } from "./input-CSM87NBF.js";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { A as Avatar, a as AvatarFallback } from "./avatar-CFvO6VPc.js";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { g as getOptimizedImageUrl, a as getResponsiveSrcSet, b as getBlogImageSizes, c as buildWebpFallbackOnError } from "./imageOptimization-B2MkGC0g.js";
import { S as Skeleton } from "./skeleton-6MvOnm4j.js";
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
import "@radix-ui/react-avatar";
const CATEGORIES = [
  "All",
  "Fulfillment",
  "Inventory",
  "Supply Chain",
  "Warehouse",
  "Logistics",
  "Industry News"
];
const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return /* @__PURE__ */ jsx("div", { className: "bg-[hsl(var(--blog-navy))] border-t-4 border-[hsl(var(--blog-orange))] py-4 sticky top-0 z-40", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 overflow-x-auto scrollbar-hide", children: CATEGORIES.map((category) => /* @__PURE__ */ jsx(
    Button,
    {
      variant: "ghost",
      onClick: () => onCategoryChange(category),
      className: `
                whitespace-nowrap rounded-full px-6 py-2 transition-all duration-300
                ${selectedCategory === category ? "bg-[hsl(var(--blog-orange))] text-white shadow-[0_4px_12px_hsl(var(--blog-orange)/0.3)] translate-y-[-2px]" : "bg-transparent text-white hover:bg-[hsl(var(--blog-orange)/0.1)] hover:text-[hsl(var(--blog-orange))] border border-white/20"}
              `,
      children: category
    },
    category
  )) }) }) });
};
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return /* @__PURE__ */ jsxs("div", { className: "relative max-w-md mx-auto lg:mx-0 lg:ml-auto", children: [
    /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--blog-orange))]" }),
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "text",
        placeholder: "Search articles...",
        value: searchTerm,
        onChange: (e) => onSearchChange(e.target.value),
        className: "pl-10 border-[hsl(var(--blog-navy))] focus:border-[hsl(var(--blog-orange))] focus:ring-[hsl(var(--blog-orange))] bg-white"
      }
    )
  ] });
};
const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "You'll receive our latest articles via email."
      });
      setEmail("");
      setLoading(false);
    }, 1e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-[hsl(var(--blog-navy))] rounded-lg p-8 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-5", style: {
      backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--blog-navy)) 0px, hsl(var(--blog-navy)) 1px, transparent 1px, transparent 10px)`
    } }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-[hsl(var(--blog-orange))] flex items-center justify-center", children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6 text-white" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-[hsl(var(--blog-navy))]", children: "Stay Updated with Westfield Insights" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[hsl(var(--blog-gray-blue))] mb-6", children: "Get bi-weekly emails with the latest fulfillment strategies, warehouse optimization tips, and industry insights." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubscribe, className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "email",
            placeholder: "Enter your email address",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            className: "flex-1 border-[hsl(var(--blog-navy))] focus:border-[hsl(var(--blog-orange))] focus:ring-[hsl(var(--blog-orange))]"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: loading,
            className: "bg-[hsl(var(--blog-orange))] hover:bg-[hsl(var(--blog-orange-hover))] text-white px-8",
            children: loading ? "Subscribing..." : "Subscribe"
          }
        )
      ] })
    ] })
  ] });
};
const AspectRatio = AspectRatioPrimitive.Root;
const getCategoryGradient = (category) => {
  const gradients = {
    "3PL-LOGISTICS": "from-[hsl(220,80%,20%)] via-[hsl(220,70%,35%)] to-[hsl(180,60%,45%)]",
    "AMAZON FBA": "from-[hsl(var(--blog-orange))] via-[hsl(25,90%,55%)] to-[hsl(15,85%,60%)]",
    "FULFILLMENT": "from-[hsl(var(--blog-navy))] via-[hsl(220,75%,30%)] to-[hsl(220,70%,45%)]",
    "3PL & FULFILLMENT": "from-[hsl(240,75%,25%)] via-[hsl(260,65%,40%)] to-[hsl(220,70%,50%)]",
    "PREP CENTER GUIDE": "from-[hsl(280,70%,25%)] via-[hsl(280,60%,45%)] to-[hsl(320,65%,55%)]",
    "SHOPIFY": "from-[hsl(150,70%,25%)] via-[hsl(150,60%,40%)] to-[hsl(150,55%,55%)]"
  };
  const key = category?.toUpperCase().replace(/\s+/g, "-");
  return gradients[key] || "from-[hsl(215,25%,20%)] via-[hsl(215,20%,35%)] to-[hsl(215,20%,45%)]";
};
const getCategoryColor = (category) => {
  const colors = {
    "3PL-LOGISTICS": "hsl(180,60%,45%)",
    "AMAZON FBA": "hsl(var(--blog-orange))",
    "FULFILLMENT": "hsl(220,70%,45%)",
    "3PL & FULFILLMENT": "hsl(220,70%,50%)",
    "PREP CENTER GUIDE": "hsl(320,65%,55%)",
    "SHOPIFY": "hsl(150,55%,55%)"
  };
  return colors[category?.toUpperCase().replace(/\s+/g, "-")] || "hsl(215,20%,45%)";
};
const getCategoryIcon = (category) => {
  const icons = { "3PL-LOGISTICS": "🏢", "AMAZON FBA": "📦", "FULFILLMENT": "🚚", "3PL & FULFILLMENT": "🏢", "PREP CENTER GUIDE": "📊", "SHOPIFY": "🛍️" };
  return icons[category?.toUpperCase().replace(/\s+/g, "-")] || "📄";
};
const extractNumber = (title) => title.match(/\b(\d+)\b/)?.[1] || null;
const getInitials = (name) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "WP";
const getPattern = (variant) => {
  if (variant === "accent-border") return "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)";
  if (variant === "side-accent") return "repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 30px)";
  return "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)";
};
const BlogCard = ({ id, title, slug, excerpt, publishedAt, category, authorName, isFeatured = false, variant = "standard", coverImageUrl, priority = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const gradient = getCategoryGradient(category);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);
  const titleNumber = extractNumber(title);
  const effectiveImageUrl = imageError || !coverImageUrl ? void 0 : coverImageUrl;
  const optimizedImageUrl = getOptimizedImageUrl(effectiveImageUrl);
  const responsiveSrcSet = getResponsiveSrcSet(effectiveImageUrl);
  const onImgError = buildWebpFallbackOnError(effectiveImageUrl);
  if (isFeatured) {
    return /* @__PURE__ */ jsx(Link, { to: `/blog/${slug}`, className: "group relative block bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] transition-all duration-700 ease-out hover:-translate-y-3 border-2 border-[hsl(var(--border))]", children: effectiveImageUrl ? /* @__PURE__ */ jsxs("div", { className: "relative h-[480px] overflow-hidden", children: [
      /* @__PURE__ */ jsxs(AspectRatio, { ratio: 16 / 9, className: "h-full", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: optimizedImageUrl,
            srcSet: responsiveSrcSet,
            sizes: getBlogImageSizes("featured"),
            alt: `${title} - Westfield Prep Center blog cover image`,
            width: 1200,
            height: 675,
            className: `h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`,
            loading: priority ? "eager" : "lazy",
            decoding: "async",
            fetchpriority: priority ? "high" : "auto",
            onLoad: () => setImageLoaded(true),
            onError: (e) => {
              if (onImgError) onImgError(e);
              setImageError(true);
            }
          }
        ),
        !imageLoaded && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10 mix-blend-overlay", style: { backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "4px 4px" } })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-6 left-6 z-10", children: /* @__PURE__ */ jsxs("div", { className: "backdrop-blur-md bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 font-semibold text-xs uppercase tracking-wider shadow-lg", style: { borderColor: categoryColor }, children: [
        categoryIcon,
        " ",
        category
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-6 right-6 z-10", children: /* @__PURE__ */ jsx("div", { className: "backdrop-blur-md bg-[hsl(var(--blog-orange))]/90 text-white px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg animate-pulse", children: "⭐ Featured" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 p-8 z-10", children: /* @__PURE__ */ jsxs("div", { className: "backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl max-w-3xl space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-white leading-tight group-hover:text-[hsl(var(--blog-orange))] transition-colors duration-300", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-white/90 line-clamp-2", children: excerpt }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-white/80 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8 border-2 border-white/30", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-white/20 text-white text-xs", children: getInitials(authorName) }) }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: authorName || "Westfield Team" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("time", { children: format(new Date(publishedAt), "MMM dd, yyyy") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "secondary", className: "bg-white text-[hsl(var(--blog-navy))] hover:bg-[hsl(var(--blog-orange))] hover:text-white font-semibold group/btn", children: [
          "Read Full Article",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" })
        ] })
      ] }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: `relative grid md:grid-cols-2 gap-0`, children: [
      /* @__PURE__ */ jsxs("div", { className: `relative h-64 md:h-full bg-gradient-to-br ${gradient} overflow-hidden`, children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10", style: { backgroundImage: getPattern("standard") } }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-48 h-48 opacity-20", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white rounded-bl-[100px]" }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-9xl opacity-20 group-hover:scale-110 transition-transform duration-700", children: categoryIcon }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-8 left-8", children: /* @__PURE__ */ jsx("div", { className: "backdrop-blur-md bg-white/30 text-white px-6 py-3 rounded-full border-2 border-white/50 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-black uppercase tracking-widest", children: "Featured Article" })
        ] }) }) }),
        category && /* @__PURE__ */ jsx("div", { className: "absolute bottom-8 left-8 backdrop-blur-md bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30", children: category })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative p-12 bg-white flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-[hsl(210,30%,12%)] mb-6 leading-tight group-hover:text-[hsl(var(--blog-orange))] transition-colors duration-300", children: title }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-[hsl(210,15%,35%)] mb-8 line-clamp-3", children: excerpt })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-[hsl(210,15%,35%)]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Avatar, { className: "h-10 w-10 border-2 border-[hsl(var(--border))]", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-[hsl(210,20%,96%)] text-[hsl(210,30%,12%)] font-semibold", children: getInitials(authorName) }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: authorName || "Westfield Team" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("time", { children: format(new Date(publishedAt), "MMM dd, yyyy") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Button, { className: "w-full group/btn", children: [
            "Read Full Article",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" })
          ] })
        ] })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(Link, { to: `/blog/${slug}`, className: "group relative block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] transition-all duration-500 ease-out hover:-translate-y-2 border border-[hsl(var(--border))]", children: [
    variant === "accent-border" && /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5 z-20", style: { backgroundColor: categoryColor } }),
    variant === "side-accent" && /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b transition-all duration-300 group-hover:w-2 z-20", style: { backgroundImage: `linear-gradient(to bottom, ${categoryColor}, transparent)` } }),
    effectiveImageUrl ? /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs(AspectRatio, { ratio: 4 / 3, children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: optimizedImageUrl,
            srcSet: responsiveSrcSet,
            sizes: getBlogImageSizes("card"),
            alt: `${title} - Westfield Prep Center blog cover image`,
            width: 800,
            height: 600,
            className: `h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] ${imageLoaded ? "opacity-100" : "opacity-0"}`,
            loading: "lazy",
            decoding: "async",
            onLoad: () => setImageLoaded(true),
            onError: (e) => {
              if (onImgError) onImgError(e);
              setImageError(true);
            }
          }
        ),
        !imageLoaded && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10 mix-blend-overlay", style: { backgroundImage: variant === "side-accent" ? "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)" : "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px)", backgroundSize: variant === "side-accent" ? "4px 4px" : "auto" } })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 z-10", children: /* @__PURE__ */ jsxs("div", { className: "backdrop-blur-md bg-white/90 px-3 py-1.5 rounded-full border font-semibold text-xs uppercase tracking-wider shadow-lg", style: { borderColor: categoryColor, color: categoryColor }, children: [
        categoryIcon,
        " ",
        category
      ] }) }),
      variant === "accent-border" && titleNumber && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 z-10", children: /* @__PURE__ */ jsx("div", { className: "backdrop-blur-md bg-white/90 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg", style: { color: categoryColor }, children: titleNumber }) }),
      variant === "accent-border" && /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 right-4 text-6xl opacity-20", style: { filter: "blur(1px)" }, children: categoryIcon })
    ] }) : /* @__PURE__ */ jsxs("div", { className: `relative h-32 bg-gradient-to-br ${gradient} overflow-hidden`, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-30", style: { backgroundImage: getPattern(variant) } }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsxs("div", { className: "backdrop-blur-md bg-white/10 text-white px-3 py-1.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider", style: { borderColor: categoryColor }, children: [
        categoryIcon,
        " ",
        category
      ] }) }),
      variant === "accent-border" && titleNumber && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsx("div", { className: "bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg backdrop-blur-md", children: titleNumber }) }),
      variant === "accent-border" && /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-4 text-5xl opacity-20", children: categoryIcon })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative p-6 bg-white", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-[hsl(210,30%,12%)] mb-3 line-clamp-2 group-hover:text-[hsl(var(--blog-orange))] transition-colors duration-300", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-[hsl(210,15%,35%)] mb-4 line-clamp-2 text-sm", children: excerpt }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-[hsl(210,15%,35%)]", children: [
          /* @__PURE__ */ jsx(Avatar, { className: "h-7 w-7 border border-[hsl(var(--border))]", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-[hsl(210,20%,96%)] text-[hsl(210,30%,12%)] text-xs font-semibold", children: getInitials(authorName) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: authorName || "Westfield Team" }),
            /* @__PURE__ */ jsx("time", { className: "text-xs", children: format(new Date(publishedAt), "MMM dd, yyyy") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[hsl(var(--blog-orange))] font-semibold text-sm relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[hsl(var(--blog-orange))] after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left", children: [
          "Read Article",
          /* @__PURE__ */ jsx(MoveRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1" })
        ] })
      ] })
    ] })
  ] });
};
const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
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
      const { data, error } = await supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false });
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
        (post) => post.title.toLowerCase().includes(term) || post.excerpt?.toLowerCase().includes(term)
      );
    }
    setFilteredPosts(filtered);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "Prep Center Blog | E-Commerce Tips & Fulfillment Insights - Westfield" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Expert insights from our Los Angeles prep center. Learn about Amazon FBA prep, Shopify fulfillment, and e-commerce logistics best practices." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://westfieldprepcenter.com/blog" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Prep Center Blog | E-Commerce Tips & Fulfillment Insights - Westfield" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Expert insights from our Los Angeles prep center. Learn about Amazon FBA prep, Shopify fulfillment, and e-commerce logistics best practices." }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://westfieldprepcenter.com/blog" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Prep Center Blog | E-Commerce Tips & Fulfillment Insights - Westfield" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Expert insights from our Los Angeles prep center. Learn about Amazon FBA prep, Shopify fulfillment, and e-commerce logistics best practices." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png" })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "collectionPage", data: { posts: posts.slice(0, 10) } }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("section", { className: "relative py-20 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: { background: "linear-gradient(135deg, hsl(210 30% 12%), hsl(28 100% 50%))" } }),
      /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-[hsl(28,100%,50%)] text-white px-4 py-2 rounded-full mb-6", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm uppercase", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Industry Insights" }) })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-6xl font-bold text-white mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Blog" }) }),
        /* @__PURE__ */ jsx("div", { className: "w-32 h-1 bg-[hsl(28,100%,50%)] mx-auto mb-6" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-white/90", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Expert fulfillment strategies, warehouse optimization tips, and logistics insights" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-[hsl(210,20%,96%)]", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx(NewsletterSignup, {}) }) }),
    /* @__PURE__ */ jsx(CategoryFilter, { selectedCategory, onCategoryChange: setSelectedCategory }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-[hsl(210,30%,12%)]", children: selectedCategory === "All" ? /* @__PURE__ */ jsx(TranslatedText, { children: "All Articles" }) : selectedCategory }),
        /* @__PURE__ */ jsx(SearchBar, { searchTerm, onSearchChange: setSearchTerm })
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsxs("div", { className: "space-y-4 min-h-[400px]", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-32 w-full rounded-lg" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-3/4" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-5/6" })
      ] }, i)) }) : filteredPosts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-2", children: /* @__PURE__ */ jsx(TranslatedText, { children: "No Articles Found" }) })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        filteredPosts.length > 0 && /* @__PURE__ */ jsx("div", { className: "mb-12", children: /* @__PURE__ */ jsx(
          BlogCard,
          {
            id: filteredPosts[0].id,
            title: filteredPosts[0].title,
            slug: filteredPosts[0].slug,
            excerpt: filteredPosts[0].excerpt || "",
            publishedAt: filteredPosts[0].published_at,
            category: filteredPosts[0].category,
            authorName: filteredPosts[0].author_name,
            coverImageUrl: filteredPosts[0].cover_image_url || void 0,
            isFeatured: true,
            priority: true
          },
          filteredPosts[0].id
        ) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredPosts.slice(1).map((post, index) => {
          const variants = ["standard", "accent-border", "side-accent"];
          const variant = variants[index % 3];
          return /* @__PURE__ */ jsx(
            BlogCard,
            {
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt || "",
              publishedAt: post.published_at,
              category: post.category,
              authorName: post.author_name,
              coverImageUrl: post.cover_image_url || void 0,
              variant
            },
            post.id
          );
        }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-[hsl(210,30%,12%)] border-t-4 border-[hsl(28,100%,50%)]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-white mb-6", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ready to Optimize Your Fulfillment?" }) }),
      /* @__PURE__ */ jsx(Button, { onClick: () => window.location.href = "/contact", className: "bg-[hsl(28,100%,50%)] hover:bg-[hsl(28,100%,45%)] text-white px-8 py-6 text-lg", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get Started Today" }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Blog as default
};
