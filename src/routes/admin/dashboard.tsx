import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/pages/AdminDashboard";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Westfield Prep Center" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
