import { createFileRoute } from "@tanstack/react-router";
import InventoryManagement from "@/pages/InventoryManagement";

export const Route = createFileRoute("/inventory-management")({
  component: InventoryManagement,
});
