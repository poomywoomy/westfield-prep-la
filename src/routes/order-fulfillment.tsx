import { createFileRoute } from "@tanstack/react-router";
import OrderFulfillment from "@/pages/OrderFulfillment";

export const Route = createFileRoute("/order-fulfillment")({
  component: OrderFulfillment,
});
