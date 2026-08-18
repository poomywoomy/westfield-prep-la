import { createFileRoute } from "@tanstack/react-router";
import BlogPost from "@/pages/BlogPost";
import { getBlogSeoTitle } from "@/data/blogTitleOverrides";
import { blogPostQueryOptions } from "@/lib/blogPostQuery";
import { buildBlogPostSchemas } from "@/lib/blogSchemas";

const SITE = "https://westfieldprepcenter.com";

// Slug-specific FAQ schemas are server-rendered into the head — this replaces
// the pre-migration BLOG_FAQ_OVERRIDES injection plugin in vite.config.ts.
export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(blogPostQueryOptions(params.slug)),
  head: ({ params, loaderData }) => {
    const canonical = `${SITE}/blog/${params.slug}`;
    const post = loaderData;
    if (!post) {
      return { links: [{ rel: "canonical", href: canonical }] };
    }

    // Article/breadcrumb/FAQ/HowTo JSON-LD, server-rendered into the head.
    const scripts = buildBlogPostSchemas({
      title: post.title,
      excerpt: post.meta_description || post.excerpt || "",
      content: post.content || "",
      coverImageUrl: post.cover_image_url,
      authorName: post.author_name || "Westfield Team",
      publishedAt: post.published_at || new Date().toISOString(),
      updatedAt: post.published_at || new Date().toISOString(),
      category: post.category || "Fulfillment",
      tags: post.tags,
      slug: post.slug,
    }).map((schema) => ({
      type: "application/ld+json",
      children: JSON.stringify(schema),
    }));

    const seoTitle = getBlogSeoTitle(post.slug, post.title);
    const socialTitle = post.title.replace(/\s*\|.*$/, "");
    const description =
      post.meta_description ||
      post.excerpt ||
      `Read ${post.title} on Westfield Prep Center blog`;
    const image = post.cover_image_url
      ? post.cover_image_url.startsWith("http")
        ? post.cover_image_url
        : `${SITE}${post.cover_image_url}`
      : null;

    const meta: Array<Record<string, string>> = [
      { title: seoTitle },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "article" },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: post.meta_description || post.excerpt || "" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: socialTitle },
      { name: "twitter:description", content: description },
    ];
    if (post.tags && post.tags.length > 0) {
      meta.push({ name: "keywords", content: post.tags.join(", ") });
    }
    if (post.published_at) {
      meta.push({ property: "article:published_time", content: post.published_at });
    }
    if (post.category) {
      meta.push({ property: "article:section", content: post.category });
    }
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }

    return { meta, links: [{ rel: "canonical", href: canonical }], scripts };
  },
});
