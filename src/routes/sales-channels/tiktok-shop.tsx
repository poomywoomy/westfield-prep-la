import { createFileRoute } from "@tanstack/react-router";
import SalesChannelTikTokShop from "@/pages/sales-channels/TikTokShop";

import { faqs } from "@/data/pageContent/TikTokShop";
import { softwareSchema, serviceSchema, faqSchema, ldScripts } from "@/data/pageSchemas";

export const Route = createFileRoute("/sales-channels/tiktok-shop")({
  component: SalesChannelTikTokShop,
  head: () => ({
    meta: [
          {
                "title": "TikTok Shop Fulfillment by Expert TikTok Fulfillment Center"
          },
          {
                "name": "description",
                "content": "Boost your TikTok shop sales with our TikTok fulfillment center. Quick, accurate, and hassle-free order processing to keep your customers happy. Contact now!"
          },
          {
                "property": "og:title",
                "content": "TikTok Shop Fulfillment Los Angeles | Westfield 3PL"
          },
          {
                "property": "og:description",
                "content": "Fulfill viral TikTok Shop orders with 6hr processing, surge capacity, and branded packaging."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/sales-channels/tiktok-shop"
          },
          {
                "property": "og:type",
                "content": "website"
          }
    ],
    scripts: ldScripts([serviceSchema({ name: "TikTok Shop Fulfillment", description: "Professional TikTok Shop fulfillment services with real-time order sync, surge capacity, and rapid pick/pack for viral demand in Los Angeles." }), faqSchema(faqs), softwareSchema()]),
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/sales-channels/tiktok-shop"
          }
    ],
  }),
});
