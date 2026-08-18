import { createFileRoute } from "@tanstack/react-router";
import SalesChannelAmazon from "@/pages/sales-channels/Amazon";

export const Route = createFileRoute("/sales-channels/amazon")({
  component: SalesChannelAmazon,
  head: () => ({
    meta: [
          {
                "title": "Amazon FBA Prep Center Los Angeles | Westfield Prep Center"
          },
          {
                "name": "description",
                "content": "Professional Amazon FBA prep center in Los Angeles offering labeling, packaging, and compliant services with fast turnaround for sellers. Get started today."
          },
          {
                "property": "og:title",
                "content": "Amazon FBA Prep Center Los Angeles | Westfield 3PL"
          },
          {
                "property": "og:description",
                "content": "Expert FBA prep with 24hr turnaround, 99.8% compliance, and 1M+ units prepped. Trusted by Amazon sellers nationwide."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/sales-channels/amazon"
          },
          {
                "property": "og:type",
                "content": "website"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/sales-channels/amazon"
          }
    ],
  }),
});
