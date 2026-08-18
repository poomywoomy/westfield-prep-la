# Finish the TanStack Start migration

Steps 1 through 8 are done: the new framework scaffolding, routes, styles, dependency merge, router compat shim, SSR guards, and the edge-function classification are all in place. Both build gates are green (`bun run build` exits 0, `tsc --noEmit` is clean).

What remains is verification and the publishing flip.

## Remaining work

1. **SSR serve check (gate 3)** — restart the dev server, then request every route over HTTP and confirm each returns 200 with real content rather than the error fallback. Auth-only routes (admin, client dashboard) get probed for a redirect/gate response instead of full content. Any route that 500s or renders "This page didn't load" gets fixed (usually a browser-only import that must become a dynamic import) and all gates re-run.

2. **Client runtime check (gate 4)** — after the preview hydrates, read the runtime error and console channels and confirm no hydration mismatches or client crashes. Fix and re-run gates if anything appears.

3. **Spot-check SEO output** — confirm the FAQ page and blog post pages now emit their JSON-LD schemas in the server-rendered HTML, which was the original reason for moving to TanStack Start.

4. **Flip the publishing pipeline** — write `.lovable/project.json` marking the project as TanStack Start, read it back to verify, and record the migration as complete.

## Notes

- Nothing published changes until you hit Publish; the live site keeps serving the current version throughout.
- All 28 backend functions stay where they are (they depend on scheduled triggers, webhooks, and secrets tied to the current runtime), so no backend behaviour changes.
- If anything looks wrong afterwards, reverting this migration from chat history restores the previous setup, including the publishing pipeline.
