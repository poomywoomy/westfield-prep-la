# Migrate Westfield Prep Center to TanStack Start

Move the site off the Vite + React Router SPA setup and onto TanStack Start so pages are server-rendered. Today the marketing pages ship as an empty HTML shell that fills in with JavaScript, which is why FAQ and blog schema had to be hand-injected through a custom build plugin. After the move, every page renders real HTML on the server, and metadata and structured data come from the page itself.

## Why this helps SEO

- Real server-rendered HTML for crawlers on every route, including blog posts pulled from the database.
- Titles, descriptions, canonicals, and JSON-LD emitted in the initial response instead of being patched in by React Helmet after load.
- The custom HTML-injection workaround in `vite.config.ts` (FAQ page schemas plus the per-blog FAQ overrides) is no longer needed and gets replaced by native route metadata.
- Faster first paint, which feeds Core Web Vitals.

## Scope of the migration

This project is large, so the plan is explicit about what moves:

- 40 routes in `App.tsx` become file-based routes, including admin and client portal routes.
- Auth guards (`ProtectedRoute` / admin gating) are inventoried and reattached to every route that had them, then verified so no protected page becomes public.
- Providers around the router (auth, theme, query client, tooltip, Helmet) move into the root route.
- Design tokens in `src/index.css`, including the West Coast Technical Editorial tokens and the JetBrains Mono setup, are carried over to the new stylesheet.
- Everything in `index.html` (analytics, verification tags, base metadata, favicons) moves into root route metadata.
- The Vite FAQ/blog schema injection plugin is retired and those schemas become route-level structured data.
- The lazy-route retry helper is replaced by TanStack's own route loading.

## What stays exactly as-is

- Lovable Cloud backend: database, tables, RLS policies, storage buckets.
- All 28 edge functions stay deployed on the backend and keep their current URLs. Nothing about ASN, shipment, billing, Shopify, ROI report, or email flows changes.
- Blog content in the database, images in storage, and all published URLs.
- Header, footer, and logo.
- The ROI calculator and its email report.

## Technical notes

- Runs the built-in `migrate-to-tanstack` workflow: preflight build check, project scan, framework scaffold swap, dependency merge, file-based route generation, then a green build plus typecheck plus a route-serve check before completion.
- TypeScript strict mode turns on (`strictNullChecks` is currently off), so expect a wave of type fixes across the codebase during the migration. These are fixed properly, not silenced.
- React Router imports are replaced by TanStack Router equivalents; `useSearchParams` call sites in Launchpad, ResetPassword, and ContactForm keep working through a compatibility shim.
- Browser-only code paths (photo lightbox portals, chatbot, anything touching `window` at module scope) get server-safe guards.
- Publishing switches to the TanStack pipeline once the build is green. The custom domains stay pointed at the same project.

## Risks and rollback

- This touches every page in the app, so the whole site needs a click-through afterwards: marketing pages, blog, login, client dashboard, admin dashboard.
- The preview keeps showing the current app while the migration runs; the new version appears when it completes.
- If anything looks wrong, reverting this message from chat history restores the current setup, including the publishing pipeline.
