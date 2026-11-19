import { createFileRoute } from "@tanstack/react-router";
import MigratedServicePage from "@/components/services/MigratedServicePage";
import { createMigratedServiceHead, MIGRATED_SERVICE_PAGES } from "@/data/migratedServicePages";

const page = MIGRATED_SERVICE_PAGES["3pl-fulfillment-services-los-angeles"];

export const Route = createFileRoute("/3pl-fulfillment-services-los-angeles")({
  component: () => <MigratedServicePage page={page} />,
  head: () => createMigratedServiceHead(page),
});
