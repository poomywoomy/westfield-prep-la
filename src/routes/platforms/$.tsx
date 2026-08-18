import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy redirect ported from the pre-migration App.tsx (<Navigate replace />)
export const Route = createFileRoute("/platforms/$")({
  beforeLoad: () => {
    throw redirect({ to: "/sales-channels/shopify", replace: true });
  },
});
