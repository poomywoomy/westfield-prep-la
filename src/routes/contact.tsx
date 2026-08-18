import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
          {
                "title": "Contact Westfield Prep Center | Shopify & Amazon 3PL"
          },
          {
                "name": "description",
                "content": "Contact Westfield Prep Center to discuss Shopify fulfillment, Amazon FBA prep, or custom 3PL solutions. Nationwide service with fast onboarding and dedicated support."
          },
          {
                "name": "robots",
                "content": "index, follow"
          },
          {
                "property": "og:type",
                "content": "website"
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/contact"
          },
          {
                "property": "og:title",
                "content": "Contact Westfield 3PL | Get a Quote"
          },
          {
                "property": "og:description",
                "content": "Get a custom 3PL quote for Shopify fulfillment & Amazon FBA prep."
          },
          {
                "property": "og:image",
                "content": "https://westfieldprepcenter.com/hero-warehouse-optimized.webp"
          },
          {
                "property": "og:site_name",
                "content": "Westfield Prep Center"
          },
          {
                "name": "twitter:card",
                "content": "summary_large_image"
          },
          {
                "name": "twitter:site",
                "content": "@Westfield3PL"
          },
          {
                "name": "twitter:title",
                "content": "Contact Westfield 3PL | Get a Quote"
          },
          {
                "name": "twitter:description",
                "content": "Contact us for Shopify fulfillment & Amazon FBA prep quotes."
          },
          {
                "name": "twitter:image",
                "content": "https://westfieldprepcenter.com/hero-warehouse-optimized.webp"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/contact"
          }
    ],
  }),
});
