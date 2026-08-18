import { createFileRoute } from "@tanstack/react-router";
import ReceivingInspection from "@/pages/ReceivingInspection";

export const Route = createFileRoute("/receiving-inspection")({
  component: ReceivingInspection,
});
