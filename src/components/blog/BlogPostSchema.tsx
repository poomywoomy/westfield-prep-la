import { Helmet } from "react-helmet-async";

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

// Slug-specific FAQ schema overrides (exact copy provided by SEO team)
const FAQ_OVERRIDES: Record<string, { question: string; answer: string }[]> = {
  "why-3pl-warehousing-los-angeles-smart-business-investment": [
    {
      question: "What is 3PL warehousing Los Angeles?",
      answer:
        "3PL warehousing Los Angeles is a third-party logistics service that manages inventory storage, order fulfillment, shipping, returns, and warehouse operations for eCommerce businesses from a strategically located Los Angeles facility.",
    },
    {
      question: "How do I choose an amazon prep center near me?",
      answer:
        "Look for a local prep center with fast turnaround times, transparent pricing, strong communication, and experience handling Amazon's labeling, inspection, and shipment requirements proximity reduces transit time and makes it easier to resolve issues quickly.",
    },
    {
      question: "Why should I use prep centers for Amazon FBA?",
      answer:
        "Prep centers for Amazon FBA prepare products according to Amazon's strict packaging, labeling, inspection, and shipping requirements, helping sellers avoid delays and compliance issues.",
    },
    {
      question: "Can a 3PL warehouse manage multiple sales channels?",
      answer:
        "Yes. A professional 3PL warehouse can manage inventory and fulfill orders for Amazon, Shopify, TikTok Shop, Walmart, eBay, Etsy, and other marketplaces from one centralized location.",
    },
    {
      question: "Why is Los Angeles a preferred location for eCommerce fulfillment?",
      answer:
        "Los Angeles offers excellent access to major ports, transportation networks, and shipping carriers, allowing businesses to receive inventory faster and deliver orders more efficiently across the United States.",
    },
  ],
};

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

  // Detect FAQ sections in content
  const detectFAQs = () => {
    const faqMatches = content.match(/<details[^>]*>[\s\S]*?<summary[^>]*>(.*?)<\/summary>[\s\S]*?<\/details>/gi);
    if (!faqMatches) return null;
    
    return faqMatches.map(match => {
      const questionMatch = match.match(/<summary[^>]*>(.*?)<\/summary>/i);
      const answerMatch = match.match(/<\/summary>([\s\S]*?)<\/details>/i);
      
      if (questionMatch && answerMatch) {
        return {
          question: questionMatch[1].replace(/<[^>]+>/g, '').trim(),
          answer: answerMatch[1].replace(/<[^>]+>/g, '').trim()
        };
      }
      return null;
    }).filter(Boolean);
  };

  // Detect HowTo sections (numbered steps)
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
        text: textMatch ? textMatch[1].replace(/<[^>]+>/g, '').trim() : ""
      };
    });
  };

  const faqs = FAQ_OVERRIDES[slug] ?? detectFAQs();
  const howToSteps = detectHowTo();

  // FAQ Schema
  const faqSchema = faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  } : null;

  // HowTo Schema
  const howToSchema = howToSteps ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description: excerpt,
    step: howToSteps,
    totalTime: `PT${readingTimeMinutes}M`
  } : null;

  return (
    <Helmet>
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="article" />
      
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      {howToSchema && (
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      )}
    </Helmet>
  );
}
