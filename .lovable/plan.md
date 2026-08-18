# Post-Migration Audit and Repair

I audited the site after the TanStack upgrade by probing every route on the server, comparing the sitemap and every internal link against the live routes, and reading the server logs. No wording, titles, descriptions, or article content will change — this is purely repair work.

## What is actually broken

1. **Two indexed pages now return 404.**
   - `/labeling-compliance` — the page moved to `/labeling-fnsku` during the migration. It is still in the sitemap and is still linked from three places on the Amazon channel pages, so those links dead-end.
   - `/service-breakdown` — the page file still exists but no route was created for it during the migration, so the URL is gone.

2. **Per-page titles, descriptions, and canonical tags are missing from the server HTML.** Every page currently ships the homepage title and description in the raw source; the correct per-page values only appear after the browser runs JavaScript. Canonical tags do not appear in source at all. This defeats the main SEO reason for the upgrade.

3. **Blog article bodies are not in the server HTML.** Post content loads only in the browser, so crawlers see an empty article shell. The FAQ schema is present, but the Article/BlogPosting schema is missing from source.

4. **Server log noise from the translation layer.** The language provider reads browser storage while rendering on the server, throwing on every single request (186 occurrences in the current log). Harmless visually, but it slows rendering and hides real errors.

5. **Three sales-channel links point at pages that do not exist** (`/sales-channels/etsy`, `/sales-channels/walmart`, `/sales-channels/woocommerce`). These predate the migration but still dead-end.

## What is confirmed healthy

- All 34 sitemap URLs except the two above return 200.
- Legacy redirects (`/amazon-fba-prep`, `/shopify-fulfillment`, `/tiktok-shop-fulfillment`, `/walmart-fulfillment`, `/services`) still redirect correctly.
- Homepage, service pages, FAQ, pricing, blog index, and the West Coast page all render fully on the server.
- The 12 FAQ schemas are in the FAQ page source; blog FAQ schemas are in blog post source.
- Login, admin dashboard, and client dashboard load; auth, auto-logout, and sign-out logic are unchanged by the migration.
- Sitemap, robots.txt, images, and logo assets all serve correctly.

## The fixes

**Restore the missing URLs**
- Re-add `/labeling-compliance` so it serves the existing labeling page content (keeping `/labeling-fnsku` working as well, with the canonical unchanged).
- Re-add the `/service-breakdown` route pointing at the existing page file.
- Point the three broken sales-channel links at the correct existing destinations.

**Server-render the metadata that already exists**
- For each content route, copy the page's current title, description, canonical, and social tags — byte for byte, no rewording — into the route's server-side head so they appear in view-source. The browser-side tags stay in place, so nothing visible changes.
- Add the blog Article schema to the server output for post pages.

**Server-render blog post content**
- Load the post in the route loader so the article body and title are in the raw HTML, with the browser taking over after load. Content and formatting unchanged.

**Clean up the server-side storage access**
- Move browser-storage reads in the language provider behind a client-side guard so the server stops throwing on every request. Language switching behavior stays identical.

**Verification pass after the fixes**
- Re-probe all 34 sitemap URLs plus every internal link for 200s.
- Confirm each page's title and description in view-source match the values that render in the browser today.
- Walk the interactive flows in a real browser: contact form submit, intake form, ROI calculator email, chatbot, blog navigation, login, and the client and admin dashboards.
- Confirm the server log is clean of recurring errors.

## Technical notes

- Route additions use `createFileRoute` files under `src/routes/`; no page components are rewritten.
- Metadata porting uses the route `head()` option and reuses the exact strings currently passed to Helmet, so both paths emit identical values.
- Blog SSR uses a route loader plus `ensureQueryData` so the existing client query cache is reused rather than double-fetching.
- The language provider fix uses a hydration-safe read (`useEffect`) rather than a `typeof window` guard in the state initializer, to avoid hydration mismatches.
