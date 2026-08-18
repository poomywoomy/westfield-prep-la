import { createFileRoute } from "@tanstack/react-router";
import AdminSettings from "@/pages/AdminSettings";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
  head: () => ({
    meta: [
      { title: "Admin Settings | Westfield Prep Center" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
