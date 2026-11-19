import { createFileRoute } from "@tanstack/react-router";
import MigratedServicePage from "@/components/services/MigratedServicePage";
import { createMigratedServiceHead, MIGRATED_SERVICE_PAGES } from "@/data/migratedServicePages";

const page = MIGRATED_SERVICE_PAGES["multichannel-fulfillment-support-los-angeles-sellers"];

export const Route = createFileRoute("/multichannel-fulfillment-support-los-angeles-sellers")({
  component: () => <MigratedServicePage page={page} />,
  head: () => createMigratedServiceHead(page),
});
