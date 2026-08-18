import { createFileRoute } from "@tanstack/react-router";
import ClientDashboard from "@/pages/ClientDashboard";

export const Route = createFileRoute("/client/dashboard")({
  component: ClientDashboard,
  head: () => ({
    meta: [
      { title: "Client Dashboard | Westfield Prep Center" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
