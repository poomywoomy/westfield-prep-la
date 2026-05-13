# Convert site to prerendered static via `vite-react-ssg`

Goal: every public route ships real HTML with per-page `<title>`, meta description, canonical, OG/Twitter, and JSON-LD baked in. Bing / ChatGPT / Perplexity / LinkedIn / Slack / Facebook / X will see real content per URL instead of the homepage shell.

Pure delivery-layer refactor. No page copy, design, Supabase, edge function, sitemap, or robots.txt changes.

---

## 1. Install pinned deps

```
bun add vite-react-ssg react-helmet-async@1.3.0
```

`react-helmet-async@1.3.0` is required — newer versions break SSR.

## 2. New file: `src/ssr-polyfills.ts`

In-memory `localStorage` and `sessionStorage` polyfills, only when undefined. The Supabase client reads `localStorage` at import time and crashes the Node build otherwise. **Do not** polyfill `window` — that flips `vite-react-ssg` into the client branch and crashes on `document`.

## 3. New file: `src/routes.tsx`

Export a `RouteRecord[]` for `vite-react-ssg`. One root route whose `Component` is the providers layout (the new `App.tsx`). Every current route from `src/App.tsx` listed explicitly as a child:

- Eager import: `Index` (homepage)
- `React.lazy(() => import(...))` for every other page
- All `<Navigate>` redirect routes preserved
- `path: "*"` → `NotFound` last
- `entry: "src/main.tsx"` set so the SSG knows the client entry

## 4. Rewrite `src/App.tsx` as root layout

Strip out `BrowserRouter`, `Routes`, `Route`. New shape:

```text
QueryClientProvider
  └ TooltipProvider
    └ LanguageProvider
      └ Toaster + Sonner + GoogleAnalytics + TranslationLoadingOverlay + RouteCanonical
        └ <Suspense fallback={spinner}>
            <Outlet />
          </Suspense>
        + <ChatBot />
```

No router JSX. The SSG owns the router via `routes.tsx`.

## 5. Rewrite `src/main.tsx`

```ts
import "./ssr-polyfills";
import { ViteReactSSG } from "vite-react-ssg";
import routes from "./routes";
import "./index.css";

export const createRoot = ViteReactSSG({ routes });
```

No `createRoot(...).render()` — `ViteReactSSG` self-mounts in the browser and is consumed by the CLI on the server. Web Vitals dev-import preserved after the export.

`HelmetProvider` is removed from `main.tsx` — `vite-react-ssg`'s `<Head>` manages its own provider.

## 6. Swap Helmet → Head across all pages

Currently ~28 page/component files import `Helmet` from `react-helmet-async`. Replace each:

```diff
- import { Helmet } from "react-helmet-async";
+ import { Head } from "vite-react-ssg";
...
- <Helmet>...</Helmet>
+ <Head>...</Head>
```

Files affected:
- `src/components/StructuredData.tsx`
- `src/components/Breadcrumbs.tsx`
- `src/components/GoogleAnalytics.tsx`
- All 25 page files under `src/pages/**` that currently use `<Helmet>`

Why not Helmet directly: with two helmet copies on disk the wrong one fails at SSR with `Cannot read properties of undefined (reading 'add')`. `Head` from `vite-react-ssg` is the supported API and writes into the static HTML.

`react-helmet-async@1.3.0` stays installed because `vite-react-ssg` depends on it internally.

## 7. Strip per-route tags from `index.html`

Remove from `<head>`:
- `<title>`
- `<meta name="description">`
- `<link rel="canonical">` (and the inline `<script>` that injects one client-side)
- All `<meta property="og:*">`
- All `<meta name="twitter:*">`
- `<meta name="robots">` (if present)

Keep:
- charset, viewport, theme-color
- favicons, manifest
- font preconnects + stylesheet
- Google Site Verification meta tags
- GTM + gtag scripts

`Head` owns everything per-route now; leftover static tags become duplicates because helmet appends rather than replaces in static HTML.

## 8. Update `package.json` scripts

```json
"build": "vite-react-ssg build",
"build:dev": "vite-react-ssg build --mode development",
"dev": "vite"
```

`dev` stays on plain Vite — CSR in dev is fine and faster.

## 9. Build + verify

Run `bunx vite-react-ssg build` and confirm:

- Every route from `routes.tsx` produced a `dist/<route>.html`
- `grep -oE '<title[^>]*>[^<]*</title>' dist/<route>.html` shows the per-route title (not the homepage title) on each page
- `grep -c 'application/ld+json' dist/<route>.html` returns the expected schema count per route
- `grep -c 'data-server-rendered="true"' dist/<route>.html` returns `1`
- `dist/index.html` contains rendered body markup (not just an empty `<div id="root">`)

## Known failure modes (and fixes)

| Error | Fix |
|---|---|
| `Cannot read properties of undefined (reading 'add')` | A file still imports `Helmet` from `react-helmet-async`. Swap to `Head` from `vite-react-ssg`. |
| `Named export 'Helmet' not found` | Wrong helmet version installed. Pin `react-helmet-async@1.3.0`. |
| `localStorage is not defined` | `ssr-polyfills` not imported, or not the first import in `main.tsx`. |
| `document is not defined` | Something polyfilled `window`. Remove it. |
| Page errors with a browser API at module top level | Wrap with `if (typeof window !== 'undefined')` or move into `useEffect`. |

## Out of scope (explicitly untouched)

- Page component logic, copy, design
- `src/integrations/supabase/client.ts`
- Edge functions
- `public/sitemap.xml`, `public/robots.txt`
- Auth flows, dashboards, billing, ASN/shipment workflows

## Notes on auth routes

`/login`, `/admin/**`, `/client/**` will get prerendered shells too (the gated content still loads client-side after auth check). That's harmless — they render as their pre-auth state and hydrate normally. If you want them excluded from prerender output later, we can add `entry: false` per route, but defaulting to "prerender everything" matches the stated goal.
