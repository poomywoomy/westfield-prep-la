import { createFileRoute } from "@tanstack/react-router";
import ClientDashboard from "@/pages/ClientDashboard";

export const Route = createFileRoute("/client/dashboard")({
  component: ClientDashboard,
});
