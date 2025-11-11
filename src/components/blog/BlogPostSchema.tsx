import { Helmet } from "react-helmet";

interface BlogPostSchemaProps {
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  authorName: string;
  authorBio: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags?: string[];
  slug: string;
}

export function BlogPostSchema({
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
  slug,
}: BlogPostSchemaProps) {
  const baseUrl = window.location.origin;
  const articleUrl = `${baseUrl}/blog/${slug}`;
  
  // Calculate word count for reading time
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
          "https://www.linkedin.com/company/westfield-prep-center/",
          "https://www.facebook.com/westfieldprepcenter",
          "https://g.page/westfield-prep-center"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Service",
          "email": "info@westfieldprep.com"
        }
      }
    ]
  };

  // Breadcrumb schema (separate from @graph)
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

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}
