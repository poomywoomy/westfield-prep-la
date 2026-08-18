import { createFileRoute } from "@tanstack/react-router";
import WestCoastFulfillment from "@/pages/WestCoastFulfillment";

export const Route = createFileRoute("/west-coast-fulfillment")({
  component: WestCoastFulfillment,
});
