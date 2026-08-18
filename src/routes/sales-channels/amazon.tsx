import { createFileRoute } from "@tanstack/react-router";
import SalesChannelAmazon from "@/pages/sales-channels/Amazon";

export const Route = createFileRoute("/sales-channels/amazon")({
  component: SalesChannelAmazon,
});
