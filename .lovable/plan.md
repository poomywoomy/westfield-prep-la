## Goal

Apply the warm, premium "Soft Linen & Sunset" aesthetic (already shipped on Why Choose Us) across the entire homepage. Preserve every piece of information, the live `BlogPreview`, Header, Footer, and Logo. Add a dedicated Launchpad mention section. Optimize for conversion with stronger CTAs and custom handcrafted graphics.

## Scope

Touch only homepage section components plus a tiny CSS addition. Do **not** modify Header, Footer, Logo, BlogPreview data flow, or any routing.

## Aesthetic System (reused from Why Choose Us)

- Background: `--wcu-linen` (#FAF5EF) cream with `wcu-paper-grain` texture
- Surfaces: white + `--wcu-cream` / `--wcu-peach` cards with stitched borders
- Accent: `--wcu-sunset` (#FF7A3D) for CTAs, underlines, icons
- Text: `--wcu-ink` (deep aubergine), `--wcu-ink-soft` for body
- Custom SVG primitives reused: `HandUnderline`, `OrganicDivider`, topographic backdrops, sunset gradient blobs
- Add a few new shared graphics (sunburst badge, ribbon stamp, dotted route line, peach blob frame)

## Section-by-section redesign

Sections keep their copy and order, only visuals change. Files edited in `src/components/`:

1. **PremiumHero.tsx** — Repaint to linen background with paper grain. Sunset gradient blobs behind a hand-illustrated warehouse skyline SVG. Headline keeps current text; accent word gets `HandUnderline`. Primary CTA = sunset solid "Get Free Fulfillment Audit", secondary = outlined "View Pricing". Trust badges become peach pill cards with stitched borders.

2. **StatsStrip.tsx** — Cream cards with sunset numerals, hand-drawn ticks, organic divider top/bottom.

3. **UseCaseSection.tsx** — Persona cards as peach "polaroid" tiles with stitched edges and sunset corner stamps.

4. **ValueProposition.tsx** — Two-column with custom SVG illustrations (boxes, conveyor belt, route line) on cream paper.

5. **Services.tsx** — Bento-style service cards with handcrafted icon glyphs (replace generic Lucide with bespoke SVG set), sunset hover glow.

6. **HowItWorksProcess.tsx** — Replace timeline with a meandering dotted SVG path connecting 4 numbered sunset circles (mirrors JourneyPath from WCU).

7. **PlatformCompatibility.tsx** — Reuse the brand SVG logos already centralized; lay them on a peach "shelf" with subtle drop shadow. Logos themselves untouched.

8. **Reviews.tsx** — Quote cards become tan paper notes with sunset quotation marks and a wax-seal style avatar frame.

9. **LocationShowcase.tsx** — Stylized LA map with sunset star marker, peach skyline silhouette behind.

10. **NEW: LaunchpadCallout.tsx** — Inserted between `LocationShowcase` and `BlogPreview`. Full-bleed cream-to-peach band with custom rocket-on-runway SVG, headline "Westfield Launchpad — From idea to shipping in weeks", short value bullets, sunset CTA → `/launchpad`.

11. **BlogPreview.tsx** — Wrapper restyled (linen bg, sunset section heading with `HandUnderline`); the live blog data fetch and card list logic remain unchanged so new posts continue to appear automatically. Cards get peach stitched borders.

12. **FAQAccordion.tsx** — Cream accordion panels, sunset "+" toggles, hand-drawn divider between items.

13. **FinalCTA.tsx** — Sunset gradient band with paper grain, oversized headline + dual CTAs (audit + pricing), confetti-dot SVG accents.

14. **Compliance.tsx** — Light cream strip with stitched badge frames around compliance marks.

15. **StickyMobileCTA.tsx** — Restyled to sunset pill on linen with subtle shadow.

## CTAs / conversion enhancements

- Every section ends with a contextual sunset CTA (audit, pricing, or contact) — no dead ends.
- Hero, mid-page (after Services), Launchpad band, and FinalCTA = 4 conversion checkpoints.
- Sticky mobile CTA always visible.
- Trust badges (orders fulfilled, accuracy, years) repeat near each CTA cluster.

## CSS additions (`src/index.css`)

Append a small block (no token overrides):
- `.wcu-stitched` border helper
- `.wcu-shadow-soft` warm drop shadow
- `@keyframes wcu-float` for hero blobs

No changes to existing tokens, dark mode, or other pages.

## Constraints respected

- Header, Footer, Logo: untouched
- All copy/info preserved verbatim
- BlogPreview data source unchanged (auto-updates with new posts)
- Single H1 per page (hero only)
- All SVGs added to `BrandIcons.tsx` where shared, inline where one-off
- No new routes, no DB changes, no dependencies

## Files to be modified

- `src/index.css` (append helpers only)
- `src/components/PremiumHero.tsx`
- `src/components/StatsStrip.tsx`
- `src/components/UseCaseSection.tsx`
- `src/components/ValueProposition.tsx`
- `src/components/Services.tsx`
- `src/components/HowItWorksProcess.tsx`
- `src/components/PlatformCompatibility.tsx`
- `src/components/Reviews.tsx`
- `src/components/LocationShowcase.tsx`
- `src/components/BlogPreview.tsx`
- `src/components/FAQAccordion.tsx`
- `src/components/FinalCTA.tsx`
- `src/components/Compliance.tsx`
- `src/components/StickyMobileCTA.tsx`
- `src/components/BrandIcons.tsx` (add new shared SVGs)
- `src/pages/Index.tsx` (insert `<LaunchpadCallout />` between LocationShowcase and BlogPreview)

## Files to be created

- `src/components/LaunchpadCallout.tsx`
