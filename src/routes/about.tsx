import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";

import { aboutPageSchema, breadcrumbSchema, ldScripts } from "@/data/pageSchemas";

const TITLE = "About Westfield Prep Center | Los Angeles Fulfillment and Prep Center";
const DESCRIPTION =
  "Westfield Prep Center is a Los Angeles fulfillment and prep center for e-commerce brands shipping 1,000 or more orders a month. Meet the facility, the numbers, and how we run it.";
const IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/bXqmPMMaXvQ7FVHXCE76ed3moJI3/social-images/social-1759478221094-Westfield_Prep_Center_Logo_Square.png";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://westfieldprepcenter.com/about" },
      { property: "og:image", content: IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: IMAGE },
    ],
    scripts: ldScripts([
      aboutPageSchema(),
      breadcrumbSchema([
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
      ]),
    ]),
    links: [{ rel: "canonical", href: "https://westfieldprepcenter.com/about" }],
  }),
});
