import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy redirect ported from the pre-migration App.tsx (<Navigate replace />)
export const Route = createFileRoute("/amazon-fba-prep")({
  beforeLoad: () => {
    throw redirect({ to: "/sales-channels/amazon", replace: true });
  },
});
