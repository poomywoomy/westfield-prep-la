import { createFileRoute } from "@tanstack/react-router";
import SalesChannels from "@/pages/SalesChannels";

import { supportedPlatforms } from "@/data/supportedPlatforms";
import { itemListSchema, ldScripts } from "@/data/pageSchemas";

export const Route = createFileRoute("/sales-channels/")({
  component: SalesChannels,
  head: () => ({
    meta: [
          {
                "title": "Supported Sales Channels | Multi-Channel Fulfillment - Westfield Prep Center"
          },
          {
                "name": "description",
                "content": "We support all major e-commerce platforms including Shopify, Amazon, TikTok Shop, Walmart, eBay, and more. Multi-channel fulfillment from our Los Angeles warehouse."
          }
    ],
    scripts: ldScripts([itemListSchema(supportedPlatforms.map((p) => ({ name: p.name, description: p.tagline, path: p.path })))]),
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/sales-channels"
          }
    ],
  }),
});
