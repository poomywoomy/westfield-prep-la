import { createFileRoute } from "@tanstack/react-router";
import WhyChooseUs from "@/pages/WhyChooseUs";

export const Route = createFileRoute("/why-choose-us")({
  component: WhyChooseUs,
  head: () => ({
    meta: [
          {
                "title": "Why Choose Our Los Angeles Prep Center | Westfield Prep Center"
          },
          {
                "name": "description",
                "content": "Discover why e-commerce sellers choose Westfield Prep Center in Los Angeles. Photo-proof QC, same-day processing, boutique service, and full insurance coverage. Learn what makes us different."
          },
          {
                "property": "og:title",
                "content": "Why Choose Our Los Angeles Prep Center | Westfield Prep Center"
          },
          {
                "property": "og:description",
                "content": "Discover why e-commerce sellers choose Westfield Prep Center in Los Angeles. Photo-proof QC, same-day processing, boutique service, and full insurance coverage."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/why-choose-us/"
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
                "content": "Why Choose Our Los Angeles Prep Center | Westfield Prep Center"
          },
          {
                "name": "twitter:description",
                "content": "Discover why e-commerce sellers choose Westfield Prep Center. Photo-proof QC, same-day processing, boutique service, and full insurance coverage."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/why-choose-us/"
          }
    ],
  }),
});
