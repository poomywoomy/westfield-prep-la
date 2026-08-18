import { createFileRoute } from "@tanstack/react-router";
import SalesChannelShopify from "@/pages/sales-channels/Shopify";

export const Route = createFileRoute("/sales-channels/shopify")({
  component: SalesChannelShopify,
  head: () => ({
    meta: [
          {
                "title": "Shopify Fulfillment Center with Expert Order Management"
          },
          {
                "name": "description",
                "content": "Westfield Prep Center is a Shopify fulfillment center that offers efficient Shopify order management, inventory control, and scalable fulfillment solutions."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/sales-channels/shopify"
          },
          {
                "property": "og:type",
                "content": "website"
          },
          {
                "property": "og:title",
                "content": "Shopify Fulfillment Services | Westfield Prep Center"
          },
          {
                "property": "og:description",
                "content": "Same-day Shopify fulfillment with QC photos and branded packaging. 400K+ orders fulfilled from Los Angeles."
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/sales-channels/shopify"
          }
    ],
  }),
});
