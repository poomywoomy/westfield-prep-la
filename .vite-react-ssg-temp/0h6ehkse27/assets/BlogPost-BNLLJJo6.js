import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { m as cn, s as supabase, B as Button, E as toast, H as Header, T as TranslatedText, F as Footer, S as StructuredData } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { Calendar, ArrowRight, Building2, Mail, Share2, Twitter, Facebook, Linkedin, Check, Link as Link$1, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { marked } from "marked";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Brv6tPqq.js";
import { g as getOptimizedImageUrl, a as getResponsiveSrcSet, b as getBlogImageSizes, c as buildWebpFallbackOnError } from "./imageOptimization-B2MkGC0g.js";
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
import "@radix-ui/react-popover";
const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  const validLanguage = hljs.getLanguage(language || "") ? language : "plaintext";
  const highlighted = hljs.highlight(code, { language: validLanguage || "plaintext" }).value;
  return `<pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
};
renderer.table = (header, body) => {
  return `<table>
    <thead>${header}</thead>
    <tbody>${body}</tbody>
  </table>`;
};
renderer.tablecell = (content, flags) => {
  const type = flags.header ? "th" : "td";
  const align = flags.align ? ` style="text-align:${flags.align}"` : "";
  return `<${type}${align}>${content}</${type}>`;
};
renderer.link = function(href, title, text) {
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${href}"${titleAttr}>${text}</a>`;
};
marked.setOptions({
  gfm: true,
  // GitHub Flavored Markdown
  breaks: true,
  // Convert \n to <br>
  renderer
});
const parseMarkdown = (markdown) => {
  if (!markdown) return "";
  try {
    const html = marked.parse(markdown);
    return html;
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return markdown;
  }
};
const BlogPostRenderer = ({ content }) => {
  const htmlContent = parseMarkdown(content);
  const normalizedHeadingHtml = htmlContent.replace(/<h1(\b[^>]*)>/gi, "<h2$1>").replace(/<\/h1>/gi, "</h2>");
  const htmlWithLazyLoad = normalizedHeadingHtml.replace(
    /<img\b([^>]*?)\bsrc=(["'])([^"']+)\2([^>]*)>/gi,
    (_match, preAttrs, quote, src, postAttrs) => {
      const isBlogImage = src.includes("/blog-images/");
      const isRasterFallback = /\.(jpe?g|png)(\?.*)?$/i.test(src);
      let finalSrc = src;
      let extraAttrs = "";
      if (isBlogImage && isRasterFallback) {
        finalSrc = src.replace(/\.(jpe?g|png)(\?.*)?$/i, ".webp$2");
        const safeOriginal = src.replace(/'/g, "&apos;");
        extraAttrs += ` onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${safeOriginal}';}"`;
      }
      return `<img${preAttrs}src=${quote}${finalSrc}${quote}${postAttrs} loading="lazy" decoding="async"${extraAttrs}>`;
    }
  );
  const enhancedHtml = DOMPurify.sanitize(htmlWithLazyLoad, {
    ALLOWED_TAGS: [
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "a",
      "ul",
      "ol",
      "li",
      "code",
      "pre",
      "img",
      "blockquote",
      "strong",
      "em",
      "br",
      "hr",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "details",
      "summary"
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "loading", "decoding", "open", "onerror"]
  });
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "prose prose-lg max-w-none animate-fade-in\n        [&>h1]:text-[hsl(var(--blog-navy))] [&>h1]:font-bold [&>h1]:text-4xl [&>h1]:mb-6 [&>h1]:mt-2 [&>h1]:border-l-4 [&>h1]:border-[hsl(var(--blog-orange))] [&>h1]:pl-4\n        [&>h2]:text-[hsl(var(--blog-navy))] [&>h2]:font-bold [&>h2]:text-3xl [&>h2]:mb-4 [&>h2]:mt-10 [&>h2]:border-l-4 [&>h2]:border-[hsl(var(--blog-orange))] [&>h2]:pl-4\n        [&>h3]:text-[hsl(var(--blog-navy))] [&>h3]:font-bold [&>h3]:text-2xl [&>h3]:mb-3 [&>h3]:mt-8 [&>h3]:border-l-4 [&>h3]:border-[hsl(var(--blog-orange))] [&>h3]:pl-4\n        [&>p]:text-[hsl(var(--blog-gray-blue))] [&>p]:text-lg [&>p]:leading-relaxed [&>p]:mb-4\n        [&>strong]:text-[hsl(var(--blog-navy))] [&>strong]:font-semibold\n        [&>em]:text-[hsl(var(--blog-gray-blue))] [&>em]:italic\n        [&_a]:text-[hsl(var(--blog-orange))] [&_a]:no-underline [&_a]:hover:underline [&_a]:transition-all\n        [&>blockquote]:bg-[hsl(var(--blog-light-blue))] [&>blockquote]:border-l-4 [&>blockquote]:border-[hsl(var(--blog-orange))] [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:text-[hsl(var(--blog-navy))] [&>blockquote]:text-xl [&>blockquote]:rounded-r-lg [&>blockquote]:shadow-sm [&>blockquote]:hover:shadow-md [&>blockquote]:transition-shadow\n        [&>ul]:list-none [&>ul]:my-6 [&>ul]:space-y-3\n        [&>ul>li]:relative [&>ul>li]:pl-8 [&>ul>li]:mb-3\n        [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-[0.65em] [&>ul>li::before]:w-2.5 [&>ul>li::before]:h-2.5 [&>ul>li::before]:rounded-full [&>ul>li::before]:bg-[hsl(var(--blog-orange))]\n        [&>ol]:list-none [&>ol]:counter-reset-[list] [&>ol]:my-6 [&>ol]:space-y-3\n        [&>ol>li]:relative [&>ol>li]:pl-10 [&>ol>li]:mb-3 [&>ol>li]:counter-increment-[list]\n        [&>ol>li::before]:content-[counter(list)] [&>ol>li::before]:absolute [&>ol>li::before]:left-0 [&>ol>li::before]:top-0 [&>ol>li::before]:w-7 [&>ol>li::before]:h-7 [&>ol>li::before]:rounded-full [&>ol>li::before]:bg-[hsl(var(--blog-orange))] [&>ol>li::before]:text-white [&>ol>li::before]:text-sm [&>ol>li::before]:font-bold [&>ol>li::before]:flex [&>ol>li::before]:items-center [&>ol>li::before]:justify-center\n        [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-6 [&>img]:hover:shadow-[0_12px_24px_hsla(28,100%,50%,0.25)] [&>img]:transition-shadow [&>img]:duration-300\n        [&>pre]:bg-[hsl(var(--blog-navy))] [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-6 [&>pre]:shadow-sm\n        [&>pre>code]:text-white [&>pre>code]:bg-transparent\n        [&>code]:bg-[hsl(var(--blog-navy))] [&>code]:text-[hsl(var(--blog-orange))] [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm\n        [&>table]:w-full [&>table]:border-collapse [&>table]:my-8 [&>table]:rounded-lg [&>table]:overflow-hidden [&>table]:bg-white [&>table]:shadow-lg [&>table]:border-2 [&>table]:border-[hsl(var(--blog-navy))]\n        [&>table>thead]:bg-[hsl(var(--blog-navy))] [&>table>thead]:text-white\n        [&>table>thead>tr>th]:p-4 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-bold [&>table>thead>tr>th]:text-white [&>table>thead>tr>th]:uppercase [&>table>thead>tr>th]:tracking-wider [&>table>thead>tr>th]:text-sm [&>table>thead>tr>th]:sticky [&>table>thead>tr>th]:top-0 [&>table>thead>tr>th]:z-10 [&>table>thead>tr>th]:bg-[hsl(var(--blog-navy))]\n        [&>table>tbody>tr>td]:p-4 [&>table>tbody>tr>td]:border-t-2 [&>table>tbody>tr>td]:border-[hsl(var(--blog-navy))]/10 [&>table>tbody>tr>td]:text-[hsl(var(--blog-gray-blue))] [&>table>tbody>tr>td]:align-top\n        [&>table>tbody>tr:nth-child(odd)]:bg-[hsl(var(--blog-light-blue))]\n        [&>table>tbody>tr]:transition-colors [&>table>tbody>tr]:duration-200 [&>table>tbody>tr:hover]:bg-[hsl(var(--blog-light-blue))]/70\n        [&>details]:my-6 [&>details]:border [&>details]:border-[hsl(var(--blog-orange))]/30 [&>details]:rounded-lg [&>details]:overflow-hidden [&>details]:bg-white [&>details]:shadow-sm [&>details]:hover:shadow-md [&>details]:transition-shadow\n        [&>details>summary]:bg-[hsl(var(--blog-light-blue))] [&>details>summary]:p-4 [&>details>summary]:cursor-pointer [&>details>summary]:font-semibold [&>details>summary]:text-[hsl(var(--blog-navy))] [&>details>summary]:flex [&>details>summary]:items-center [&>details>summary]:gap-2 [&>details>summary]:hover:bg-[hsl(var(--blog-orange))]/10 [&>details>summary]:transition-colors\n        [&>details>summary::marker]:content-[''] [&>details>summary::-webkit-details-marker]:hidden\n        [&>details>summary::before]:content-['▶'] [&>details>summary::before]:text-[hsl(var(--blog-orange))] [&>details>summary::before]:text-sm [&>details>summary::before]:transition-transform [&>details>summary::before]:inline-block\n        [&>details[open]>summary::before]:rotate-90\n        [&>details>summary~*]:p-4 [&>details>summary~*]:text-[hsl(var(--blog-gray-blue))]\n        [&_hr]:border-[hsl(var(--blog-orange))]/20 [&_hr]:my-8\n      ",
      dangerouslySetInnerHTML: { __html: enhancedHtml }
    }
  );
};
function BlogPostSchema({
  title,
  excerpt,
  content,
  coverImageUrl,
  authorName,
  authorBio,
  publishedAt,
  updatedAt,
  category,
  tags,
  slug
}) {
  const baseUrl = window.location.origin;
  const articleUrl = `${baseUrl}/blog/${slug}`;
  const wordCount = content.split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": articleUrl
        },
        "headline": title,
        "description": excerpt,
        "image": {
          "@type": "ImageObject",
          "url": coverImageUrl ? `${baseUrl}${coverImageUrl}` : `${baseUrl}/hero-warehouse-optimized.webp`,
          "width": 1200,
          "height": 675
        },
        "datePublished": publishedAt,
        "dateModified": updatedAt,
        "author": {
          "@type": "Person",
          "name": authorName,
          "url": `${baseUrl}/blog`
        },
        "publisher": {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
          "name": "Westfield Prep Center",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/westfield-logo.png`,
            "width": 250,
            "height": 60
          }
        },
        "articleSection": category,
        "keywords": tags?.join(", "),
        "wordCount": wordCount,
        "timeRequired": `PT${readingTimeMinutes}M`,
        "inLanguage": "en-US",
        "isAccessibleForFree": true
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Westfield Prep Center",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/westfield-logo.png`,
          "width": 250,
          "height": 60
        },
        "sameAs": [
          "https://www.linkedin.com/company/westfield-prep-center/?viewAsMember=true",
          "https://www.instagram.com/westfieldprepcenter/",
          "https://x.com/Westfield3PL"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Service",
          "email": "info@westfieldprep.com"
        }
      }
    ]
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${baseUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": articleUrl
      }
    ]
  };
  const detectFAQs = () => {
    const faqMatches = content.match(/<details[^>]*>[\s\S]*?<summary[^>]*>(.*?)<\/summary>[\s\S]*?<\/details>/gi);
    if (!faqMatches) return null;
    return faqMatches.map((match) => {
      const questionMatch = match.match(/<summary[^>]*>(.*?)<\/summary>/i);
      const answerMatch = match.match(/<\/summary>([\s\S]*?)<\/details>/i);
      if (questionMatch && answerMatch) {
        return {
          question: questionMatch[1].replace(/<[^>]+>/g, "").trim(),
          answer: answerMatch[1].replace(/<[^>]+>/g, "").trim()
        };
      }
      return null;
    }).filter(Boolean);
  };
  const detectHowTo = () => {
    const stepMatches = content.match(/##\s*Step\s+\d+[:\s]+(.*?)(?=##|$)/gis);
    if (!stepMatches || stepMatches.length < 3) return null;
    return stepMatches.map((step, index) => {
      const nameMatch = step.match(/##\s*Step\s+\d+[:\s]+(.*?)[\r\n]/i);
      const textMatch = step.match(/[\r\n]([\s\S]*?)$/);
      return {
        "@type": "HowToStep",
        position: index + 1,
        name: nameMatch ? nameMatch[1].trim() : `Step ${index + 1}`,
        text: textMatch ? textMatch[1].replace(/<[^>]+>/g, "").trim() : ""
      };
    });
  };
  const faqs = detectFAQs();
  const howToSteps = detectHowTo();
  const faqSchema = faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  } : null;
  const howToSchema = howToSteps ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description: excerpt,
    step: howToSteps,
    totalTime: `PT${readingTimeMinutes}M`
  } : null;
  return /* @__PURE__ */ jsxs(Head, { children: [
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: "article" }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(schema) }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) }),
    faqSchema && /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(faqSchema) }),
    howToSchema && /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(howToSchema) })
  ] });
}
const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h2");
    const parsedHeadings = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`;
      const level = parseInt(heading.tagName.substring(1));
      return {
        id,
        text: heading.textContent || "",
        level
      };
    });
    setHeadings(parsedHeadings);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );
    setTimeout(() => {
      const actualHeadings = document.querySelectorAll("article h2");
      actualHeadings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
        observer.observe(heading);
      });
    }, 100);
    return () => observer.disconnect();
  }, [content]);
  if (headings.length === 0) return null;
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  return /* @__PURE__ */ jsxs("nav", { className: "sticky top-24 bg-card border rounded-lg p-6 shadow-sm", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-6", children: "Table of Contents" }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: headings.map((heading) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => scrollToHeading(heading.id),
        className: cn(
          "w-full text-left py-1.5 px-3 rounded-md transition-colors duration-200",
          "text-sm font-medium",
          activeId === heading.id ? "text-primary border-l-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
        ),
        children: heading.text
      }
    ) }, heading.id)) })
  ] });
};
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
const RelatedPosts = ({ currentPostId, category }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchRelatedPosts();
  }, [currentPostId, category]);
  const fetchRelatedPosts = async () => {
    try {
      let query = supabase.from("blog_posts").select("id, title, slug, excerpt, published_at, category").eq("published", true).neq("id", currentPostId).order("published_at", { ascending: false }).limit(3);
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching related posts:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading || posts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "py-12 bg-muted/30", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-8 text-center", children: "Related Articles" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: posts.map((post) => {
      const gradient = getCategoryGradient(post.category);
      return /* @__PURE__ */ jsx(Link, { to: `/blog/${post.slug}`, className: "group", children: /* @__PURE__ */ jsxs(Card, { className: "h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-[hsl(var(--blog-orange))]", children: [
        /* @__PURE__ */ jsxs("div", { className: `relative h-24 bg-gradient-to-br ${gradient} overflow-hidden`, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: {
            backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 10px,
                            rgba(255,255,255,0.1) 10px,
                            rgba(255,255,255,0.1) 20px
                          )`
          } }) }),
          post.category && /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-4 backdrop-blur-md bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-white/30", children: post.category })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-xl mb-3 group-hover:text-[hsl(var(--blog-orange))] transition-colors line-clamp-2 leading-tight", children: post.title }),
          post.excerpt && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed", children: post.excerpt }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("time", { dateTime: post.published_at, children: format(new Date(post.published_at), "MMM dd, yyyy") })
            ] }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-[hsl(var(--blog-orange))] transition-transform group-hover:translate-x-1" })
          ] })
        ] })
      ] }) }, post.id);
    }) })
  ] }) }) });
};
const AuthorBio = ({
  authorName = "Westfield Prep Center Team",
  authorBio = "Expert team at Westfield Prep Center with years of experience in e-commerce fulfillment, Amazon FBA prep, and Shopify logistics."
}) => {
  return /* @__PURE__ */ jsx(Card, { className: "mt-12 bg-gradient-to-br from-muted/50 to-muted/30 border-primary/20", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center", children: /* @__PURE__ */ jsx(Building2, { className: "w-10 h-10 text-white" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4 mb-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-foreground", children: [
            "Written by ",
            authorName
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "E-commerce Fulfillment Experts" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsxs(Button, { variant: "default", size: "sm", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }),
          "Contact Us"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4", children: authorBio }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [
        /* @__PURE__ */ jsx(Link, { to: "/amazon-fba-prep", className: "text-primary hover:underline", children: "Amazon FBA Prep" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "•" }),
        /* @__PURE__ */ jsx(Link, { to: "/shopify-fulfillment", className: "text-primary hover:underline", children: "Shopify Fulfillment" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "•" }),
        /* @__PURE__ */ jsx(Link, { to: "/why-choose-us", className: "text-primary hover:underline", children: "Why Choose Us" })
      ] })
    ] })
  ] }) }) });
};
const ShareButtons = ({
  title,
  url = window.location.href,
  variant = "default",
  size = "default",
  showLabel = true
}) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard."
      });
      setTimeout(() => setCopied(false), 2e3);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually.",
        variant: "destructive"
      });
    }
  };
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };
  return /* @__PURE__ */ jsxs(Popover, { children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant, size, className: "gap-2", children: [
      /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }),
      showLabel && /* @__PURE__ */ jsx("span", { children: "Share" })
    ] }) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-72 p-4", align: "end", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-sm text-foreground", children: "Share this article" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: shareLinks.twitter,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity",
            children: [
              /* @__PURE__ */ jsx(Twitter, { className: "h-4 w-4" }),
              "Twitter"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: shareLinks.facebook,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-[#1877F2] text-white hover:opacity-90 transition-opacity",
            children: [
              /* @__PURE__ */ jsx(Facebook, { className: "h-4 w-4" }),
              "Facebook"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: shareLinks.linkedin,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-[#0A66C2] text-white hover:opacity-90 transition-opacity",
            children: [
              /* @__PURE__ */ jsx(Linkedin, { className: "h-4 w-4" }),
              "LinkedIn"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: shareLinks.email,
            className: "flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }),
              "Email"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: copyToClipboard,
          variant: "outline",
          className: "w-full justify-start",
          size: "sm",
          children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 mr-2 text-green-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-600", children: "Link copied!" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Link$1, { className: "h-4 w-4 mr-2" }),
            "Copy link"
          ] })
        }
      ),
      navigator.share && /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: nativeShare,
          variant: "outline",
          className: "w-full justify-start",
          size: "sm",
          children: [
            /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4 mr-2" }),
            "More options..."
          ]
        }
      )
    ] }) })
  ] });
};
const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");
  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);
  useEffect(() => {
    if (post?.content) {
      setHtmlContent(parseMarkdown(post.content));
    }
  }, [post?.content]);
  useEffect(() => {
    if (post?.id) {
      const incrementViewCount = async () => {
        try {
          await supabase.rpc("increment_blog_view_count", { post_id: post.id });
        } catch (error) {
          console.error("Error incrementing view count:", error);
        }
      };
      incrementViewCount();
    }
  }, [post?.id]);
  const fetchPost = async () => {
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single();
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
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Loading article..." }) })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (!post) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { prioritizeSeoTags: true, children: [
      /* @__PURE__ */ jsx("title", { children: (() => {
        const slugTitles = {
          "why-3pl-fulfillment-is-essential-for-startups-scaling-with-amazon-fba": "3PL Fulfillment for Startups Scaling with Amazon FBA",
          "3pl-fulfillment-startups-scaling-amazon-fba": "3PL Fulfillment for Startups Scaling with Amazon FBA",
          "fulfillment-center-los-angeles-growing-ecommerce-brands": "Fulfillment Center Los Angeles for Growing Ecommerce Brands"
        };
        if (slugTitles[post.slug]) return slugTitles[post.slug];
        return post.title.replace(/\s*\|.*$/, "");
      })() }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: post.meta_description || post.excerpt || `Read ${post.title} on Westfield Prep Center blog` }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: `https://westfieldprepcenter.com/blog/${post.slug}` }),
      post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("meta", { name: "keywords", content: post.tags.join(", ") }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: post.title.replace(/\s*\|.*$/, "") }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: post.meta_description || post.excerpt || "" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: `https://westfieldprepcenter.com/blog/${post.slug}` }),
      post.cover_image_url && /* @__PURE__ */ jsx("meta", { property: "og:image", content: post.cover_image_url.startsWith("http") ? post.cover_image_url : `${window.location.origin}${post.cover_image_url}` }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "article" }),
      post.published_at && /* @__PURE__ */ jsx("meta", { property: "article:published_time", content: post.published_at }),
      post.category && /* @__PURE__ */ jsx("meta", { property: "article:section", content: post.category }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: post.title.replace(/\s*\|.*$/, "") }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: post.meta_description || post.excerpt || `Read ${post.title} on Westfield Prep Center blog` }),
      post.cover_image_url && /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: post.cover_image_url.startsWith("http") ? post.cover_image_url : `${window.location.origin}${post.cover_image_url}` })
    ] }),
    /* @__PURE__ */ jsx(
      BlogPostSchema,
      {
        title: post.title,
        excerpt: post.meta_description || post.excerpt || "",
        content: post.content || "",
        coverImageUrl: post.cover_image_url || void 0,
        authorName: post.author_name || "Westfield Team",
        authorBio: post.author_bio || "Expert team at Westfield Prep Center with years of experience in e-commerce fulfillment.",
        publishedAt: post.published_at || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: post.published_at || (/* @__PURE__ */ new Date()).toISOString(),
        category: post.category || "Fulfillment",
        tags: post.tags || [],
        slug: post.slug
      }
    ),
    /* @__PURE__ */ jsx(StructuredData, { type: "breadcrumb", data: [
      { name: "Home", url: "https://westfieldprepcenter.com/" },
      { name: "Blog", url: "https://westfieldprepcenter.com/blog/" },
      { name: post.title, url: `https://westfieldprepcenter.com/blog/${post.slug}` }
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [
        { label: "Blog", path: "/blog" },
        { label: post.title, path: `/blog/${post.slug}` }
      ] }),
      /* @__PURE__ */ jsxs("article", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("section", { className: "relative min-h-[420px] md:min-h-[520px] overflow-hidden", children: post.cover_image_url ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: getOptimizedImageUrl(post.cover_image_url) || post.cover_image_url,
                srcSet: getResponsiveSrcSet(post.cover_image_url),
                sizes: getBlogImageSizes("hero"),
                alt: `${post.title} - Westfield Prep Center blog cover image`,
                width: 1600,
                height: 900,
                className: "w-full h-full object-cover",
                loading: "eager",
                decoding: "async",
                fetchpriority: "high",
                onError: (e) => {
                  const fallback = buildWebpFallbackOnError(post.cover_image_url);
                  if (fallback) {
                    fallback(e);
                  } else {
                    e.currentTarget.src = "/hero-warehouse-optimized.webp";
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 relative pt-20 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/blog", className: "inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors group", children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" }),
              /* @__PURE__ */ jsx(TranslatedText, { children: "Back to Blog" })
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-6xl font-bold mb-6 text-white leading-tight", children: post.title }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 md:gap-6 text-white/90", children: [
              post.published_at && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("time", { dateTime: post.published_at, className: "text-sm", children: format(new Date(post.published_at), "MMMM dd, yyyy") })
              ] }),
              /* @__PURE__ */ jsx(
                ShareButtons,
                {
                  title: post.title,
                  variant: "ghost",
                  size: "sm"
                }
              )
            ] })
          ] }) })
        ] }) : /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 pt-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxs(Link, { to: "/blog", className: "inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors group", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" }),
            /* @__PURE__ */ jsx(TranslatedText, { children: "Back to Blog" })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight", children: post.title }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-4 md:gap-6 text-muted-foreground", children: post.published_at && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("time", { dateTime: post.published_at, className: "text-sm", children: format(new Date(post.published_at), "MMMM dd, yyyy") })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8", children: [
            post.excerpt && /* @__PURE__ */ jsx("div", { className: "mb-12 p-6 bg-muted/50 border-l-4 border-primary rounded-r-lg", children: /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-foreground italic leading-relaxed", children: post.excerpt }) }),
            post.category && /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("span", { className: "inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full", children: post.category }) }),
            /* @__PURE__ */ jsx(BlogPostRenderer, { content: htmlContent }),
            /* @__PURE__ */ jsx(
              AuthorBio,
              {
                authorName: post.author_name || void 0,
                authorBio: post.author_bio || void 0
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
              /* @__PURE__ */ jsx(Link, { to: "/blog", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "lg", className: "group", children: [
                /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" }),
                /* @__PURE__ */ jsx(TranslatedText, { children: "Back to All Posts" })
              ] }) }),
              /* @__PURE__ */ jsx(
                ShareButtons,
                {
                  title: post.title,
                  variant: "default",
                  size: "lg"
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("aside", { className: "lg:col-span-4", children: /* @__PURE__ */ jsx(TableOfContents, { content: htmlContent }) })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(RelatedPosts, { currentPostId: post.id, category: post.category }),
        /* @__PURE__ */ jsxs("section", { className: "relative py-20 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 text-center relative", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4 text-white", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Ready to Scale Your Business?" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Partner with Westfield Prep Center for professional fulfillment services" }) }),
            /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(Button, { size: "lg", className: "bg-white text-primary hover:bg-white/90 shadow-xl", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get a Free Quote" }) }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  BlogPost as default
};
