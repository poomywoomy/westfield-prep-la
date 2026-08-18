import { createFileRoute } from "@tanstack/react-router";
import SalesChannels from "@/pages/SalesChannels";

export const Route = createFileRoute("/sales-channels/")({
  component: SalesChannels,
});
