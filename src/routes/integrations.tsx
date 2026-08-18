import { createFileRoute } from "@tanstack/react-router";
import Integrations from "@/pages/Integrations";

export const Route = createFileRoute("/integrations")({
  component: Integrations,
  head: () => ({
    meta: [
          {
                "title": "Shopify & Amazon 3PL Integrations | Westfield Prep Center"
          },
          {
                "name": "description",
                "content": "Connect Shopify, Amazon, Walmart, and 20+ platforms to Westfield's 3PL. Real-time order sync, inventory visibility — no developers required."
          },
          {
                "name": "robots",
                "content": "index, follow"
          },
          {
                "property": "og:title",
                "content": "Shopify & Amazon 3PL Integrations | Westfield Prep Center"
          },
          {
                "property": "og:description",
                "content": "Connect Shopify, Amazon, Walmart, and 20+ platforms to Westfield's 3PL. Real-time order sync, inventory visibility — no developers required."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/integrations"
          },
          {
                "property": "og:type",
                "content": "website"
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
                "content": "Shopify & Amazon 3PL Integrations | Westfield Prep Center"
          },
          {
                "name": "twitter:description",
                "content": "Connect Shopify, Amazon, Walmart, and 20+ platforms to Westfield's 3PL. Real-time order sync, inventory visibility."
          },
          {
                "name": "twitter:image",
                "content": "https://westfieldprepcenter.com/hero-warehouse-optimized.webp"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/integrations"
          }
    ],
  }),
});
