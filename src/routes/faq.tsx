import { createFileRoute } from "@tanstack/react-router";
import FAQ from "@/pages/FAQ";
import { FAQ_SCHEMAS } from "@/data/faqSchemas";

const TITLE = "Comprehensive FAQ - Westfield Prep Center | Shopify, Amazon FBA & TikTok Shop";
const DESCRIPTION =
  "Get answers to 90+ questions about Shopify fulfillment, Amazon FBA prep, TikTok Shop logistics, pricing, shipping, and e-commerce operations in Los Angeles.";
const SOCIAL_TITLE = "Comprehensive FAQ - Westfield Prep Center";
const SOCIAL_DESCRIPTION =
  "Get answers to 90+ questions about Shopify fulfillment, Amazon FBA prep, TikTok Shop logistics, pricing, shipping, and e-commerce operations.";
const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png";
const CANONICAL = "https://westfieldprepcenter.com/faq";

// The 12 FAQPage JSON-LD schemas are server-rendered into the head —
// this replaces the pre-migration faq.html static entry + Vite injection plugin.
export const Route = createFileRoute("/faq")({
  component: FAQ,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:title", content: SOCIAL_TITLE },
      { property: "og:description", content: SOCIAL_DESCRIPTION },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SOCIAL_TITLE },
      { name: "twitter:description", content: SOCIAL_DESCRIPTION },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: FAQ_SCHEMAS.map((schema) => ({
      type: "application/ld+json",
      children: schema,
    })),
  }),
});
