import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
          {
                "title": "Los Angeles Fulfillment Center for Shopify and Amazon"
          },
          {
                "name": "description",
                "content": "Westfield Prep Center is a Los Angeles fulfillment center offering Shopify Amazon fulfillment, FBA prep, storage, & fast ecommerce shipping. Get started today."
          },
          {
                "name": "robots",
                "content": "index, follow"
          },
          {
                "name": "keywords",
                "content": "3pl shopify, shopify fulfillment center, amazon prep center, FBA prep center los angeles, 3pl pricing, DTC fulfillment, los angeles 3pl"
          },
          {
                "name": "geo.region",
                "content": "US-CA"
          },
          {
                "name": "geo.position",
                "content": "34.0522;-118.2437"
          },
          {
                "property": "og:type",
                "content": "website"
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/"
          },
          {
                "property": "og:site_name",
                "content": "Westfield Prep Center"
          },
          {
                "property": "og:title",
                "content": "3PL Fulfillment for Shopify, Amazon & DTC Brands"
          },
          {
                "property": "og:description",
                "content": "Shopify fulfillment, FBA prep & DTC logistics with real-time integrations. $1–2.50/unit."
          },
          {
                "property": "og:image",
                "content": "https://westfieldprepcenter.com/hero-warehouse-optimized.webp"
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
                "name": "twitter:creator",
                "content": "@Westfield3PL"
          },
          {
                "name": "twitter:title",
                "content": "3PL Fulfillment for Shopify, Amazon & DTC Brands"
          },
          {
                "name": "twitter:description",
                "content": "Westfield is a nationwide 3PL providing Shopify fulfillment, Amazon FBA prep, and DTC logistics. Transparent pricing and 24-hour turnaround."
          },
          {
                "name": "twitter:image",
                "content": "https://westfieldprepcenter.com/hero-warehouse-optimized.webp"
          }
    ],
    links: [{ rel: "canonical", href: "https://westfieldprepcenter.com/" }],
  }),
});
