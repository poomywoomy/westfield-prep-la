## Goal

Keep `https://westfieldprepcenter.com` as the canonical domain everywhere (it's your live custom domain — correct). Fix the real sitemap drift the scanner caught, and dismiss the false-positive domain warnings.

## Findings — verified against `src/App.tsx`

**Domain warnings (false positives):** The scanner thinks your project domain is `westfield-prep-la.lovable.app` and flags every reference to `westfieldprepcenter.com`. Your custom domain is the correct canonical — nothing to change. Mark these "fixed" with an explanation.

**Scanner's "missing routes" — mostly wrong:**
- `/shopify-fulfillment`, `/amazon-fba-prep`, `/tiktok-shop-fulfillment`, `/services` → these are **redirects** to `/sales-channels/*`. They should NOT be in the sitemap. The canonical `/sales-channels/*` targets are already listed. ✅ correct as-is.
- `/labeling-fnsku` → **real route, genuinely missing** from sitemap.

**Scanner's "stale entries" — both correct:**
- `/labeling-compliance` → no matching route (renamed to `/labeling-fnsku`).
- `/service-breakdown` → no matching route.

## Changes to `public/sitemap.xml`

1. Replace `/labeling-compliance` entry with `/labeling-fnsku` (priority 0.8).
2. Remove `/service-breakdown` entry.
3. Leave everything else (including all `westfieldprepcenter.com` URLs) alone.

## Changes to `public/robots.txt`

None. `Sitemap: https://westfieldprepcenter.com/sitemap.xml` is correct.

## SEO findings to mark fixed

- **Crawler rules need attention** — false positive; robots.txt correctly points at custom domain.
- **Sitemap needs attention** — fixed by the sitemap edits above (drift resolved); domain portion is a false positive.

Next scheduled scan re-verifies. You can also click "Rescan" in the SEO tab for instant confirmation.
