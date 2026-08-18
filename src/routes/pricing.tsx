import { createFileRoute } from "@tanstack/react-router";
import Pricing from "@/pages/Pricing";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
          {
                "title": "3PL Fulfillment Pricing | Shopify & Amazon Sellers | Westfield"
          },
          {
                "name": "description",
                "content": "Transparent 3PL pricing for Shopify fulfillment, Amazon FBA & WFS prep, and DTC brands. Rates from $1.00–$2.50 per unit with a 24-hour turnaround. Calculate your ROI instantly."
          },
          {
                "name": "robots",
                "content": "index, follow"
          },
          {
                "name": "author",
                "content": "Westfield Prep Center"
          },
          {
                "name": "keywords",
                "content": "3PL pricing, Shopify fulfillment, Amazon FBA prep, DTC fulfillment, Los Angeles 3PL, fulfillment center pricing, pick and pack rates"
          },
          {
                "property": "og:type",
                "content": "website"
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/pricing"
          },
          {
                "property": "og:title",
                "content": "3PL Fulfillment Pricing | Shopify & Amazon Sellers"
          },
          {
                "property": "og:description",
                "content": "Transparent 3PL pricing for Shopify fulfillment & Amazon FBA prep. $1.00–$2.50/unit. 24-hour turnaround."
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
                "content": "3PL Fulfillment Pricing | Shopify & Amazon Sellers"
          },
          {
                "name": "twitter:description",
                "content": "Transparent 3PL pricing for Shopify fulfillment & Amazon FBA prep. $1.00–$2.50/unit. 24-hour turnaround."
          },
          {
                "name": "twitter:image",
                "content": "https://westfieldprepcenter.com/hero-warehouse-optimized.webp"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/pricing"
          }
    ],
  }),
});
