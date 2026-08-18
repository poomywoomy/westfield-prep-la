import { createFileRoute } from "@tanstack/react-router";
import ServiceBreakdown from "@/pages/ServiceBreakdown";

const TITLE = "Fulfillment Service Breakdown | Westfield Prep Center";
const DESCRIPTION =
  "See exactly what each Westfield Prep Center fulfillment service covers, from receiving and prep to pick, pack, and storage in Los Angeles.";

export const Route = createFileRoute("/service-breakdown")({
  component: ServiceBreakdown,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://westfieldprepcenter.com/service-breakdown" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://westfieldprepcenter.com/service-breakdown" }],
  }),
});
