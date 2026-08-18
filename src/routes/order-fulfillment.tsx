import { createFileRoute } from "@tanstack/react-router";
import OrderFulfillment from "@/pages/OrderFulfillment";

export const Route = createFileRoute("/order-fulfillment")({
  component: OrderFulfillment,
  head: () => ({
    meta: [
          {
                "title": "Order Fulfillment Services for Businesses with a Custom"
          },
          {
                "name": "description",
                "content": "Westfield Prep Center provides reliable order fulfillment services for businesses of all sizes. From storage to packing & shipping, we handle orders with care."
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
                "content": "Order Fulfillment Services for Businesses with a Custom"
          },
          {
                "property": "og:description",
                "content": "Westfield Prep Center provides reliable order fulfillment services for businesses of all sizes. From storage to packing & shipping, we handle orders with care."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/order-fulfillment"
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
                "content": "Order Fulfillment Services for Businesses with a Custom"
          },
          {
                "name": "twitter:description",
                "content": "Westfield Prep Center provides reliable order fulfillment services for businesses of all sizes. From storage to packing & shipping, we handle orders with care."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/order-fulfillment"
          }
    ],
  }),
});
