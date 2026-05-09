# Full-Site QA Audit Plan

Goal: systematically crawl the live site, catch runtime errors, broken links, console/network failures, layout glitches, and code-level issues — then report findings (no fixes yet, since this is a discovery pass).

## Scope

Public marketing routes (logged-out) on the preview build:
`/`, `/launchpad`, `/amazon-fba-prep`, `/shopify-fulfillment`, `/tiktok-fulfillment`, `/storage-warehousing`, `/labeling-compliance`, `/kitting-bundling`, `/pricing`, `/why-choose-us`, `/integrations`, `/contact`, `/blog`, a sample blog post, `/auth`, `/404` (bad URL), plus any other routes discovered in the router.

Authenticated dashboards are out of scope for this pass (would need credentials and risks live data).

## Method

1. **Static pass (code)**
   - Enumerate routes from `src/App.tsx` / router config so nothing is missed.
   - `rg` for common red flags: `console.error`, `TODO`, `FIXME`, untyped `any` in critical paths, nested `<Helmet>`, `<a href="#">` dead links, `key` warnings in `.map`, missing `alt`, `<h1>` count per page (single-H1 rule), trailing slashes, hardcoded Duarte address.
   - Check vite/tsconfig for known issues (react dedupe, plugin).

2. **Runtime pass (browser tool)**
   For each route:
   - `navigate_to_sandbox` to the route
   - `read_console_logs` → capture errors/warnings
   - `list_network_requests` → capture 4xx/5xx, failed assets, CORS
   - `screenshot` at desktop (1440) and mobile (390) → eyeball layout/overflow/clipping
   - `observe` key interactive elements (modals, accordions, forms, nav, footer links) and `act` on a few (open Launchpad service modals, FAQ accordion, contact form validation, mobile menu)

3. **Cross-page checks**
   - Header/Footer links resolve (no 404s)
   - Logo + nav consistent
   - 404 route shows toast + redirect
   - SEO: `<title>`, meta description, canonical, single H1 per page
   - Image `alt` attributes present
   - No layout shift / horizontal scroll on mobile

4. **Backend smoke (read-only)**
   - `supabase--linter` for RLS / security warnings
   - `cloud_status` to confirm backend healthy
   - Inspect contact form submit network call (no actual spam send)

## Deliverable

A categorized report:
- **Critical** (runtime errors, broken pages, failed network calls, security findings)
- **High** (broken links, missing data, layout breaks on mobile, SEO violations like multi-H1)
- **Medium** (console warnings, accessibility gaps, slow assets)
- **Low** (cosmetic polish, copy nits)

Each finding includes: route, evidence (console line / screenshot / file:line), and a short proposed fix. No code changes during this audit — fixes get a follow-up plan you approve.

## Notes / Limits

- Won't test admin or client dashboards (need login + risk to live data).
- Won't trigger destructive actions (form submits that email, payment flows, etc.) — will validate UI only.
- Browser tool may be unavailable; if so, I'll fall back to code-only checks and tell you which routes weren't visually verified.
