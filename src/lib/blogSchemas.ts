import { BLOG_FAQ_OVERRIDES } from "@/data/blogFaqOverrides";

const BASE_URL = "https://westfieldprepcenter.com";

export interface BlogSchemaInput {
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  authorName: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags?: string[] | null;
  slug: string;
}

function detectFAQs(content: string) {
  const faqMatches = content.match(
    /<details[^>]*>[\s\S]*?<summary[^>]*>(.*?)<\/summary>[\s\S]*?<\/details>/gi,
  );
  if (!faqMatches) return null;
  const parsed = faqMatches
    .map((match) => {
      const questionMatch = match.match(/<summary[^>]*>(.*?)<\/summary>/i);
      const answerMatch = match.match(/<\/summary>([\s\S]*?)<\/details>/i);
      if (questionMatch && answerMatch) {
        return {
          question: questionMatch[1].replace(/<[^>]+>/g, "").trim(),
          answer: answerMatch[1].replace(/<[^>]+>/g, "").trim(),
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{ question: string; answer: string }>;
  return parsed.length > 0 ? parsed : null;
}

function detectHowTo(content: string) {
  const stepMatches = content.match(/##\s*Step\s+\d+[:\s]+(.*?)(?=##|$)/gis);
  if (!stepMatches || stepMatches.length < 3) return null;
  return stepMatches.map((step, index) => {
    const nameMatch = step.match(/##\s*Step\s+\d+[:\s]+(.*?)[\r\n]/i);
    const textMatch = step.match(/[\r\n]([\s\S]*?)$/);
    return {
      "@type": "HowToStep",
      position: index + 1,
      name: nameMatch ? nameMatch[1].trim() : `Step ${index + 1}`,
      text: textMatch ? textMatch[1].replace(/<[^>]+>/g, "").trim() : "",
    };
  });
}

/** Builds the JSON-LD graph for a blog post (server-renderable, no DOM access). */
export function buildBlogPostSchemas(post: BlogSchemaInput): unknown[] {
  const baseUrl = BASE_URL;
  const articleUrl = `${baseUrl}/blog/${post.slug}`;
  const wordCount = post.content.split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const imageUrl = post.coverImageUrl
    ? post.coverImageUrl.startsWith("http")
      ? post.coverImageUrl
      : `${baseUrl}${post.coverImageUrl}`
    : `${baseUrl}/hero-warehouse-optimized.webp`;

  const schemas: unknown[] = [
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
          headline: post.title,
          description: post.excerpt,
          image: { "@type": "ImageObject", url: imageUrl, width: 1200, height: 675 },
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { "@type": "Person", name: post.authorName, url: `${baseUrl}/blog` },
          publisher: {
            "@type": "Organization",
            "@id": `${baseUrl}/#organization`,
            name: "Westfield Prep Center",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/westfield-logo.png`,
              width: 250,
              height: 60,
            },
          },
          articleSection: post.category,
          keywords: post.tags?.join(", "),
          wordCount,
          timeRequired: `PT${readingTimeMinutes}M`,
          inLanguage: "en-US",
          isAccessibleForFree: true,
        },
        {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
          name: "Westfield Prep Center",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/westfield-logo.png`,
            width: 250,
            height: 60,
          },
          sameAs: [
            "https://www.linkedin.com/company/westfield-prep-center/?viewAsMember=true",
            "https://www.instagram.com/westfieldprepcenter/",
            "https://x.com/Westfield3PL",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            email: "info@westfieldprep.com",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
      ],
    },
  ];

  const faqs = BLOG_FAQ_OVERRIDES[post.slug] ?? detectFAQs(post.content);
  if (faqs && faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  const howToSteps = detectHowTo(post.content);
  if (howToSteps) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: post.title,
      description: post.excerpt,
      step: howToSteps,
      totalTime: `PT${readingTimeMinutes}M`,
    });
  }

  return schemas;
}
