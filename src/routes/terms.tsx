import { createFileRoute } from "@tanstack/react-router";
import TOS from "@/pages/TOS";

export const Route = createFileRoute("/terms")({
  component: TOS,
  head: () => ({
    meta: [
          {
                "title": "Terms of Service | Westfield Prep Center"
          },
          {
                "name": "description",
                "content": "Review our terms of service for e-commerce fulfillment and logistics. Updated September 30, 2025. Westfield Prep Center - DBA of Sathatham LLC."
          },
          {
                "name": "robots",
                "content": "noindex, follow"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/terms"
          }
    ],
  }),
});
