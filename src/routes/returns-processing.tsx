import { createFileRoute } from "@tanstack/react-router";
import ReturnsProcessing from "@/pages/ReturnsProcessing";

export const Route = createFileRoute("/returns-processing")({
  component: ReturnsProcessing,
  head: () => ({
    meta: [
          {
                "title": "Returns Processing | Los Angeles 3PL & Prep Center Services"
          },
          {
                "name": "description",
                "content": "Fast returns processing at our LA prep center. 5-hour inspection, restocking, and value recovery. Expert 3PL reverse logistics for Amazon FBA and e-commerce returns."
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
                "content": "Returns Processing | Los Angeles 3PL & Prep Center Services"
          },
          {
                "property": "og:description",
                "content": "Fast returns processing at our LA prep center. 5-hour inspection, restocking, and value recovery. Expert 3PL reverse logistics for Amazon FBA and e-commerce returns."
          },
          {
                "property": "og:url",
                "content": "https://westfieldprepcenter.com/returns-processing"
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
                "content": "Returns Processing | Los Angeles 3PL & Prep Center Services"
          },
          {
                "name": "twitter:description",
                "content": "Fast returns processing at our LA prep center. 5-hour inspection, restocking, and value recovery. Expert 3PL reverse logistics for Amazon FBA and e-commerce returns."
          },
          {
                "name": "twitter:image",
                "content": "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/returns-processing"
          }
    ],
  }),
});
