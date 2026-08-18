import { createFileRoute } from "@tanstack/react-router";
import Testimonials from "@/pages/Testimonials";

export const Route = createFileRoute("/testimonials")({
  component: Testimonials,
  head: () => ({
    meta: [
          {
                "title": "3PL Reviews | Los Angeles Prep Center Testimonials | Westfield"
          },
          {
                "name": "description",
                "content": "Read reviews from e-commerce brands using our Los Angeles 3PL and prep center services. See why sellers trust Westfield for Amazon FBA prep and Shopify fulfillment."
          },
          {
                "name": "keywords",
                "content": "3pl reviews, prep center testimonials, los angeles 3pl reviews, amazon fba prep reviews, fulfillment center reviews"
          },
          {
                "property": "og:title",
                "content": "3PL Reviews | Los Angeles Prep Center Testimonials"
          },
          {
                "property": "og:description",
                "content": "Read reviews from e-commerce brands using our Los Angeles 3PL and prep center services. See why sellers trust Westfield."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/testimonials"
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
                "content": "Customer Testimonials | Westfield Prep Center Reviews"
          },
          {
                "name": "twitter:description",
                "content": "Read real reviews from satisfied customers. See why businesses trust Westfield Prep Center for fulfillment services."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/testimonials"
          }
    ],
  }),
});
