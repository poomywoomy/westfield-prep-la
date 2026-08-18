import { createFileRoute } from "@tanstack/react-router";
import ThreePLLosAngeles from "@/pages/ThreePLLosAngeles";

export const Route = createFileRoute("/3pl-los-angeles")({
  component: ThreePLLosAngeles,
  head: () => ({
    meta: [
          {
                "title": "3PL Fulfillment Services at West Coast 3PL Warehouse"
          },
          {
                "name": "description",
                "content": "3PL fulfillment services at our West Coast 3PL warehouse help your e-commerce business grow. Fast, accurate, and reliable shipping. Get started with us today!"
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
                "content": "3PL Fulfillment Services at West Coast 3PL Warehouse"
          },
          {
                "property": "og:description",
                "content": "3PL fulfillment services at our West Coast 3PL warehouse help your e-commerce business grow. Fast, accurate, and reliable shipping. Get started with us today!"
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/3pl-los-angeles"
          },
          {
                "property": "og:image",
                "content": "/la-port-logistics.jpg"
          },
          {
                "name": "twitter:card",
                "content": "summary_large_image"
          },
          {
                "name": "twitter:title",
                "content": "3PL Fulfillment Services at West Coast 3PL Warehouse"
          },
          {
                "name": "twitter:description",
                "content": "3PL fulfillment services at our West Coast 3PL warehouse help your e-commerce business grow. Fast, accurate, and reliable shipping. Get started with us today!"
          },
          {
                "name": "twitter:image",
                "content": "/la-port-logistics.jpg"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/3pl-los-angeles"
          }
    ],
  }),
});
