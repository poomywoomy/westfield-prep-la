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

  const faqs = detectFAQs();
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
