import { createFileRoute } from "@tanstack/react-router";
import KittingBundling from "@/pages/KittingBundling";

export const Route = createFileRoute("/kitting-bundling")({
  component: KittingBundling,
});
