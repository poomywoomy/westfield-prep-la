import { createFileRoute } from "@tanstack/react-router";
import SalesChannelShopify from "@/pages/sales-channels/Shopify";

export const Route = createFileRoute("/sales-channels/shopify")({
  component: SalesChannelShopify,
});
