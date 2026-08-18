import { createFileRoute } from "@tanstack/react-router";
import ThankYou from "@/pages/ThankYou";

export const Route = createFileRoute("/thank-you")({
  component: ThankYou,
  head: () => ({
    meta: [
          {
                "title": "Thank You | Westfield Prep Center"
          },
          {
                "name": "description",
                "content": "Thank you for contacting Westfield Prep Center. We'll review your information and get back to you shortly."
          },
          {
                "name": "robots",
                "content": "noindex, follow"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/thank-you"
          }
    ],
  }),
});
