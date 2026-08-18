import { createFileRoute } from "@tanstack/react-router";
import Launchpad from "@/pages/Launchpad";

export const Route = createFileRoute("/launchpad")({
  component: Launchpad,
});
