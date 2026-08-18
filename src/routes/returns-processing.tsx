import { createFileRoute } from "@tanstack/react-router";
import ReturnsProcessing from "@/pages/ReturnsProcessing";

export const Route = createFileRoute("/returns-processing")({
  component: ReturnsProcessing,
});
