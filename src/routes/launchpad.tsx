import { createFileRoute } from "@tanstack/react-router";
import Launchpad from "@/pages/Launchpad";

export const Route = createFileRoute("/launchpad")({
  component: Launchpad,
  head: () => ({
    meta: [
          {
                "title": "Westfield Launchpad | Shopify, Amazon & Product Media Services in LA"
          },
          {
                "name": "description",
                "content": "Get your product off the ground with Shopify setup, Amazon Seller Central & A+ content, 3D product imaging, and pro studio photography from Westfield's Los Angeles team."
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
                "content": "Westfield Launchpad | Shopify, Amazon & Product Media Services in LA"
          },
          {
                "property": "og:description",
                "content": "Get your product off the ground with Shopify setup, Amazon Seller Central & A+ content, 3D product imaging, and pro studio photography from Westfield's Los Angeles team."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/launchpad"
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
                "content": "Westfield Launchpad | Shopify, Amazon & Product Media Services in LA"
          },
          {
                "name": "twitter:description",
                "content": "Get your product off the ground with Shopify setup, Amazon Seller Central & A+ content, 3D product imaging, and pro studio photography from Westfield's Los Angeles team."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/launchpad"
          }
    ],
  }),
});
