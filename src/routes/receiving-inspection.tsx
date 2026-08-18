import { createFileRoute } from "@tanstack/react-router";
import ReceivingInspection from "@/pages/ReceivingInspection";

export const Route = createFileRoute("/receiving-inspection")({
  component: ReceivingInspection,
  head: () => ({
    meta: [
          {
                "title": "Receiving & QC Inspection | Los Angeles 3PL Prep Center"
          },
          {
                "name": "description",
                "content": "Professional receiving and inspection at our LA prep center. 3PL services with photo documentation, damage detection, and same-day inventory updates."
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
                "content": "Receiving & QC Inspection | Los Angeles 3PL Prep Center"
          },
          {
                "property": "og:description",
                "content": "Professional receiving and inspection at our LA prep center. 3PL services with photo documentation, damage detection, and same-day inventory updates."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/receiving-inspection"
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
                "content": "Receiving & QC Inspection | Los Angeles 3PL Prep Center"
          },
          {
                "name": "twitter:description",
                "content": "Professional receiving and inspection at our LA prep center. 3PL services with photo documentation, damage detection, and same-day inventory updates."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/receiving-inspection"
          }
    ],
  }),
});
