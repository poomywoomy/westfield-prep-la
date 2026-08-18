import { createFileRoute } from "@tanstack/react-router";
import InventoryManagement from "@/pages/InventoryManagement";

export const Route = createFileRoute("/inventory-management")({
  component: InventoryManagement,
  head: () => ({
    meta: [
          {
                "title": "Inventory Management | Los Angeles 3PL Prep Center Services"
          },
          {
                "name": "description",
                "content": "Real-time inventory management at our Los Angeles 3PL. Prep center with SKU tracking, low-stock alerts, cycle counts, and multi-channel sync for e-commerce brands."
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
                "content": "Inventory Management | Los Angeles 3PL Prep Center Services"
          },
          {
                "property": "og:description",
                "content": "Real-time inventory management at our Los Angeles 3PL. Prep center with SKU tracking, low-stock alerts, cycle counts, and multi-channel sync for e-commerce brands."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/inventory-management"
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
                "content": "Inventory Management | Los Angeles 3PL Prep Center Services"
          },
          {
                "name": "twitter:description",
                "content": "Real-time inventory management at our Los Angeles 3PL. Prep center with SKU tracking, low-stock alerts, cycle counts, and multi-channel sync for e-commerce brands."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/inventory-management"
          }
    ],
  }),
});
