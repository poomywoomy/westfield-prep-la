## Goal
Finish the Shopify Fulfillment + Amazon FBA Prep rebuild by running the visual QA pass that was deferred, fixing anything broken, and polishing rough edges.

## Steps

1. **Visual QA at 3 breakpoints** (1440, 768, 375) for both `/shopify-fulfillment` and `/amazon-fba-prep` using browser screenshots. Capture full-page shots at each width.

2. **Fix issues found in QA**, expected categories:
   - Bento tile overflow / clipped text on mobile
   - Hero image aspect ratio at tablet (the `lg:aspect-auto` switch can leave a gap)
   - Marquee / horizontal rail overflow on small screens
   - Counter / metric tile alignment
   - Spacing rhythm between sections (consistent `py-20 md:py-28`)
   - Any missing `alt`, missing `width/height`, or `loading="lazy"` on non-hero images (LCP hygiene)
   - Single H1 confirmation on each page

3. **Console + network check** — load each page, confirm no 404s on the 12 generated images, no React key warnings, no Helmet nesting warnings.

4. **SEO sanity** — confirm `<Helmet>` title/description/canonical render, FAQ JSON-LD emits, og tags present.

5. **Polish pass** (only if QA surfaces it):
   - Tighten hero copy line-length on tablet
   - Add subtle hover states to bento tiles that are missing them
   - Ensure orange CTAs meet contrast on navy
   - Confirm `<TranslatedText>` wraps all visible English copy in v2 components

6. **Cleanup** — leave the old (v1) Shopify/Amazon components in place (already unused) per the original plan; no deletion this pass.

## Out of scope
Header, Footer, Logo, ChatBot, StickyMobileCTA, backend, copy rewrites, new sections.

## Deliverable
Both pages render cleanly at desktop / tablet / mobile with no console errors and SEO intact. Short summary of what was checked and what was fixed.
