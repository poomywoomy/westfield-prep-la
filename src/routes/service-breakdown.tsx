import { createFileRoute } from "@tanstack/react-router";
import ServiceBreakdown from "@/pages/ServiceBreakdown";

export const Route = createFileRoute("/service-breakdown")({
  component: ServiceBreakdown,
});
