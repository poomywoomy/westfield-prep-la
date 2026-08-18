import { createFileRoute } from "@tanstack/react-router";
import ClientSettings from "@/pages/ClientSettings";

export const Route = createFileRoute("/client/settings")({
  component: ClientSettings,
});
