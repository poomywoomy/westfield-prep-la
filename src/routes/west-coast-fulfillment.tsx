import { createFileRoute } from "@tanstack/react-router";
import WestCoastFulfillment from "@/pages/WestCoastFulfillment";

export const Route = createFileRoute("/west-coast-fulfillment")({
  component: WestCoastFulfillment,
  head: () => ({
    meta: [
          {
                "title": "West Coast 3PL & Fulfillment Center in Los Angeles"
          },
          {
                "name": "description",
                "content": "West Coast 3PL and fulfillment center in Los Angeles. 1 to 2 day ground across the western US, port-adjacent container receiving, FBA prep, and Shopify, Amazon, and TikTok Shop integration."
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
                "property": "og:title",
                "content": "West Coast 3PL & Fulfillment Center in Los Angeles"
          },
          {
                "property": "og:description",
                "content": "West Coast 3PL and fulfillment center in Los Angeles. 1 to 2 day ground across the western US, port-adjacent container receiving, FBA prep, and Shopify, Amazon, and TikTok Shop integration."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/west-coast-fulfillment"
          },
          {
                "property": "og:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          },
          {
                "name": "twitter:card",
                "content": "summary_large_image"
          },
          {
                "name": "twitter:title",
                "content": "West Coast 3PL & Fulfillment Center in Los Angeles"
          },
          {
                "name": "twitter:description",
                "content": "West Coast 3PL and fulfillment center in Los Angeles. 1 to 2 day ground across the western US, port-adjacent container receiving, FBA prep, and Shopify, Amazon, and TikTok Shop integration."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/west-coast-fulfillment"
          }
    ],
  }),
});
