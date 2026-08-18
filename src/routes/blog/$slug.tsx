import { createFileRoute } from "@tanstack/react-router";
import BlogPost from "@/pages/BlogPost";
import { BLOG_FAQ_OVERRIDES } from "@/data/blogFaqOverrides";

// Slug-specific FAQ schemas are server-rendered into the head — this replaces
// the pre-migration BLOG_FAQ_OVERRIDES injection plugin in vite.config.ts.
export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  head: ({ params }) => {
    const faqs = BLOG_FAQ_OVERRIDES[params.slug];
    if (!faqs || faqs.length === 0) return {};
    return {
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        },
      ],
    };
  },
});
