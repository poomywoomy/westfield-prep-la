

## Plan: Site-Wide Performance & Image Loading Audit

Site is slow primarily because of **giant unoptimized blog images** (some 1.5–1.9 MB JPGs), a **hero `<picture>` that downloads the JPG fallback even when WebP works**, and **blog images served from local `/public` instead of cloud storage** (no CDN, no WebP, no responsive variants). Console confirms LCP > 13s on the homepage.

### Findings (root causes)

1. **Hero image double-download** — `PremiumHero.tsx` uses `<picture>` with a 230 KB WebP source and a separate 230 KB JPG `<img>`. The `<img>` `src` (`/warehouse-hero-bg.jpg`) downloads even when the browser supports WebP, doubling LCP bytes. Console also flags `fetchPriority` (must be `fetchpriority` lowercase).
2. **Blog images are huge and JPG-only** — `public/blog-images/` is **16 MB total** with 6 files over 500 KB (worst: 1.9 MB). Served from the app bundle (not Supabase Storage / CDN), no WebP, no responsive `srcset`, no `width`/`height` on body images → causes layout shift and slow paints when reading articles.
3. **Featured `BlogCard` uses `loading="eager"`** on the cover image even when offscreen, fighting the browser's prioritization for the real LCP element.
4. **Blog body images get `loading="lazy"` injected but no `decoding="async"`, no dimensions, no WebP variant** — large images stall main thread on decode.
5. **Vite config still uses `@vitejs/plugin-react-swc`** while project memory mandates `@vitejs/plugin-react` (Babel) for stability/dedupe; SWC has caused dedupe regressions before.
6. **Homepage waterfalls Supabase calls** (BlogPreview query, language detection RPC, supported_languages query) with no `<link rel="preconnect">` priority for the `blog-images` domain (the supabase storage one IS preconnected — good).
7. **`Skeleton` placeholders for every Suspense section** are full-width 64–96 height blocks that briefly render then re-layout when each lazy chunk lands → contributes to perceived slowness on the homepage (CLS is 0, but perceived "popping in" is heavy).

### What we'll change

**A. Fix the hero (biggest LCP win, ~50% bytes saved)**
- `src/components/PremiumHero.tsx`: drop `<picture>`, use a single `<img src="/hero-warehouse-optimized.webp">` with `fetchpriority="high"` (lowercase), `decoding="async"`, explicit `width`/`height`. Keeps the existing preload in `index.html` working as the LCP image.
- Delete the now-unused `public/warehouse-hero-bg.jpg` (230 KB) from the deploy.

**B. Compress & convert blog images to WebP (biggest overall win, ~75% bytes saved)**
- One-time script (run in default mode) using `nix run nixpkgs#libwebp` + `nixpkgs#imagemagick`:
  - Convert every `public/blog-images/*.{jpg,png}` → `*.webp` at quality 80, max-width 1600px.
  - Also generate a `*-800w.webp` responsive variant for cards.
  - Keep original `.jpg` as fallback for legacy linked images.
- Expected: 16 MB → ~3 MB total. Largest file (1.9 MB JPG) → ~250 KB WebP.

**C. Update components that render images to prefer WebP + responsive**
- `BlogPreview.tsx`, `BlogCard.tsx`, `BlogPost.tsx`, and `BlogPostRenderer.tsx`:
  - Helper `getOptimizedImageUrl(url)` that swaps `.jpg`/`.png` → `.webp` when the URL points to `/blog-images/...` (or to the Supabase `blog-images` bucket — same filename pattern).
  - Add `srcset` for 800 w / 1600 w variants and a `sizes` attribute matching the card layout.
  - Add `width`/`height` (intrinsic 4:3 or 16:9) to every image to eliminate CLS.
  - Add `decoding="async"` everywhere.
  - **Featured BlogCard**: keep `loading="eager"` only for the very first card (the LCP candidate on `/blog`), switch all others (including `BlogPreview` cards) to `loading="lazy"`.
- `BlogPostRenderer.tsx` regex enhancement: when injecting attributes into body `<img>`, also add `decoding="async"` and rewrite `/blog-images/foo.jpg` → `/blog-images/foo.webp` with the original as a fallback in `onerror`.

**D. Fix React/Vite warnings & dedupe**
- `PremiumHero.tsx`: rename `fetchPriority` prop → `fetchpriority` (lowercase) to silence the React DOM warning shown in console.
- `vite.config.ts`: switch `@vitejs/plugin-react-swc` → `@vitejs/plugin-react` per project memory (matches existing `dedupe` config and known-good builds).

**E. Lighter homepage Suspense fallbacks**
- `src/pages/Index.tsx`: replace the 6 large `Skeleton h-96 w-full` fallbacks with `null` (or a tiny `min-h-[400px]` spacer) so the lazy chunks don't trigger huge skeleton paints that get immediately replaced. Reserves space (no CLS) without the visual "flash of skeletons."

**F. Preconnect blog image origin**
- `index.html`: add `<link rel="preconnect" href="https://gqnvkecmxjijrxhggcro.supabase.co" crossorigin>` is already present — confirm the blog images bucket served from there benefits. Add `<link rel="dns-prefetch">` for `https://www.googletagmanager.com` (currently a render-blocker).
- Make the GTM `<script>` `defer` instead of inline-blocking (currently top of `<head>`).

### Files affected

- **Edit**: `src/components/PremiumHero.tsx`, `src/components/BlogPreview.tsx`, `src/components/blog/BlogCard.tsx`, `src/components/blog/BlogPostRenderer.tsx`, `src/pages/BlogPost.tsx`, `src/pages/Index.tsx`, `src/pages/Blog.tsx`, `vite.config.ts`, `index.html`
- **New util**: `src/lib/imageOptimization.ts` — `getOptimizedImageUrl()`, `getResponsiveSrcSet()`, `getBlogImageSizes()`
- **One-time scripted asset work** (run in default mode):
  - Convert all 38 files in `public/blog-images/` to WebP (keep originals as fallback)
  - Delete unused `public/warehouse-hero-bg.jpg`
- **No DB changes**, **no edge function changes**, **no Supabase Storage migration** (we keep existing URLs working; new posts can keep uploading `.jpg` and our helper will request the WebP variant when present, falling back via `onerror` if not).

### Expected impact

- Homepage **LCP**: ~13 s → target ≤ 2.5 s (single optimized hero image, no double-download, lighter Suspense paint).
- Blog page initial load: **16 MB → ~3 MB** image budget.
- Individual blog posts: 1–2 MB cover images → 200–300 KB; body images lazy-load with WebP.
- Eliminates the React `fetchPriority` console warning.
- No visual changes — same images, same layout, same hover effects.

### Out of scope

- Migrating already-uploaded blog images from `/public/blog-images/` into the Supabase `blog-images` bucket (separate project; keep existing URLs working).
- Changing the admin Blog Editor upload pipeline (future enhancement: auto-generate WebP on upload via edge function with `EdgeRuntime.waitUntil`).
- Switching translation/Supabase architecture.

