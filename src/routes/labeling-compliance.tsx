import { createFileRoute } from "@tanstack/react-router";
import LabelingCompliance from "@/pages/LabelingCompliance";

// Legacy indexed URL restored after the migration; /labeling-fnsku stays live
// and remains the canonical target declared inside the page itself.
export const Route = createFileRoute("/labeling-compliance")({
  component: LabelingCompliance,
  head: () => ({
    meta: [
          {
                "title": "Labeling & Compliance | Los Angeles 3PL Prep Center"
          },
          {
                "name": "description",
                "content": "Expert labeling and compliance services at our LA prep center. 3PL FNSKU labeling, warning labels, and Amazon FBA compliance for e-commerce sellers."
          },
          {
                "name": "keywords",
                "content": "3pl los angeles, labeling services, prep center, fnsku labels, amazon fba compliance, ecommerce labeling"
          },
          {
                "property": "og:title",
                "content": "Labeling & Compliance | Los Angeles 3PL Prep Center"
          },
          {
                "property": "og:description",
                "content": "Expert labeling and compliance services at our LA prep center. 3PL FNSKU labeling, warning labels, and Amazon FBA compliance."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/labeling-fnsku"
          },
          {
                "property": "og:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          },
          {
                "property": "og:type",
                "content": "website"
          },
          {
                "name": "twitter:card",
                "content": "summary_large_image"
          },
          {
                "name": "twitter:title",
                "content": "Labeling & Compliance Services | Westfield Prep Center"
          },
          {
                "name": "twitter:description",
                "content": "FNSKU/barcodes, warning labels, carton labeling, and audit-ready documentation for e-commerce compliance."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/labeling-fnsku"
          }
    ],
  }),
});
