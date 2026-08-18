import { createFileRoute } from "@tanstack/react-router";
import FAQ from "@/pages/FAQ";
import { FAQ_SCHEMAS } from "@/data/faqSchemas";

// The 12 FAQPage JSON-LD schemas are now server-rendered into the head —
// this replaces the pre-migration faq.html static entry + Vite injection plugin.
export const Route = createFileRoute("/faq")({
  component: FAQ,
  head: () => ({
    scripts: FAQ_SCHEMAS.map((schema) => ({
      type: "application/ld+json",
      children: schema,
    })),
  }),
});
