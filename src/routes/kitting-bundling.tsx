import { createFileRoute } from "@tanstack/react-router";
import KittingBundling from "@/pages/KittingBundling";

import { faqSchemaData, serviceData } from "@/data/pageContent/KittingBundling";
import { serviceSchema, faqSchema, ldScripts } from "@/data/pageSchemas";

export const Route = createFileRoute("/kitting-bundling")({
  component: KittingBundling,
  head: () => ({
    meta: [
          {
                "title": "Educational Kitting & Bundling Services in Los Angeles CA"
          },
          {
                "name": "description",
                "content": "Get the best educational kitting and bundling services in Los Angeles, CA.Accurate assembly, careful packaging, and reliable fulfillment. Contact us today."
          },
          {
                "name": "keywords",
                "content": "3pl los angeles, kitting services, bundling, prep center, subscription box assembly, product kitting"
          }
    ],
    scripts: ldScripts([serviceSchema(serviceData), faqSchema(faqSchemaData)]),
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/kitting-bundling"
          }
    ],
  }),
});
