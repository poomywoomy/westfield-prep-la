import { createFileRoute } from "@tanstack/react-router";
import MigratedServicePage from "@/components/services/MigratedServicePage";
import { createMigratedServiceHead, MIGRATED_SERVICE_PAGES } from "@/data/migratedServicePages";

const page = MIGRATED_SERVICE_PAGES["third-party-logistics-los-angeles"];

export const Route = createFileRoute("/third-party-logistics-los-angeles")({
  component: () => <MigratedServicePage page={page} />,
  head: () => createMigratedServiceHead(page),
});
