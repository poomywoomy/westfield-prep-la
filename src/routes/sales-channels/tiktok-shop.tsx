import { createFileRoute } from "@tanstack/react-router";
import SalesChannelTikTokShop from "@/pages/sales-channels/TikTokShop";

export const Route = createFileRoute("/sales-channels/tiktok-shop")({
  component: SalesChannelTikTokShop,
});
