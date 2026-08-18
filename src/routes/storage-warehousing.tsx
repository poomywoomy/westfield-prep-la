import { createFileRoute } from "@tanstack/react-router";
import StorageWarehousing from "@/pages/StorageWarehousing";

export const Route = createFileRoute("/storage-warehousing")({
  component: StorageWarehousing,
});
