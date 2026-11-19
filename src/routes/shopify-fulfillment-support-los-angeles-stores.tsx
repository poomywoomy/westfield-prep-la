import { createFileRoute } from "@tanstack/react-router";
import MigratedServicePage from "@/components/services/MigratedServicePage";
import { createMigratedServiceHead, MIGRATED_SERVICE_PAGES } from "@/data/migratedServicePages";

const page = MIGRATED_SERVICE_PAGES["shopify-fulfillment-support-los-angeles-stores"];

export const Route = createFileRoute("/shopify-fulfillment-support-los-angeles-stores")({
  component: () => <MigratedServicePage page={page} />,
  head: () => createMigratedServiceHead(page),
});
