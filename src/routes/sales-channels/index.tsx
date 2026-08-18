import { createFileRoute } from "@tanstack/react-router";
import SalesChannels from "@/pages/SalesChannels";

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
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/sales-channels"
          }
    ],
  }),
});
