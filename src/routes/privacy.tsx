import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicy,
  head: () => ({
    meta: [
          {
                "title": "Privacy Policy | Westfield Prep Center"
          },
          {
                "name": "description",
                "content": "Read our privacy policy to understand how Westfield Prep Center collects, uses, and protects your data. Effective October 1, 2025."
          },
          {
                "name": "robots",
                "content": "noindex, follow"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/privacy"
          }
    ],
  }),
});
