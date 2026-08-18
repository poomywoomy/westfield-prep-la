import { createFileRoute } from "@tanstack/react-router";
import LabelingCompliance from "@/pages/LabelingCompliance";

export const Route = createFileRoute("/labeling-fnsku")({
  component: LabelingCompliance,
});
