## Goal
Rebuild `/shopify-fulfillment` and `/amazon-fba-prep` to look like an industry leader: knowledgeable, trustworthy, premium. Apple-style bento grid layout, Midnight Navy + Orange brand palette, photoreal Los Angeles warehouse imagery, distinctive custom graphics in every section. Header, Footer, and Logo stay untouched.

## Visual System (shared)
- Palette: Midnight Navy `#0A0A23`, Ink `#1F2A44`, Orange `#FF7A00`, White `#FFFFFF`. Use existing semantic tokens; add new ones if needed in `index.css`/`tailwind.config.ts`.
- Typography: large display headings, mono micro-labels (uppercase, tracked), tight body. Single H1 per page.
- Surfaces: dark navy hero panels, frosted glass cards, soft inner highlights, 1px hairline borders, subtle grain.
- Motion: framer-motion fade/scale on scroll, parallax on hero render, animated number counters in metric tiles.
- Bento grid: asymmetric tiles (2x2, 1x2, 3x1) — each tile owns one idea and one piece of art.

## Custom Photoreal Graphics (generated via imagegen, premium tier)
Each image saved to `src/assets/` and imported as ES6 modules. Distinct compositions, no repeats.

Shopify page (6 renders):
1. Hero — wide LA warehouse pick-pack floor, golden-hour light through bay doors, packers with branded mailers (16:9).
2. Branded unboxing — overhead shot of custom mailer, tissue, thank-you card, product (1:1).
3. Real-time sync — close-up of scanner gun on Shopify-branded label, motion blur conveyor (4:3).
4. Same-day shipping — packed box on dock with carrier truck reversing in (4:3).
5. QC photo proof — gloved hand inspecting product under ring light at QC bench (1:1).
6. LA port advantage — aerial of Port of LA cranes at dusk, faint warehouse overlay (16:9).

Amazon page (6 renders):
1. Hero — pallet wrapped + FNSKU labeled, FBA-bound, forklift in soft focus (16:9).
2. FNSKU labeling station — labels printing, hands applying to units (1:1).
3. Polybagging line — clear poly bags with suffocation labels, organized rows (4:3).
4. Carton & pallet build — corrugated cartons being banded onto a pallet (4:3).
5. LTL forwarding — Amazon-bound LTL truck at LA dock with BOL paperwork (16:9).
6. Photo-proof QC — clipboard + camera documenting boxed shipment (1:1).

All images use cinematic, neutral-warm grading; no text overlays in the renders themselves; navy/orange highlights present in the scene where natural.

## Page Structure — Shopify Fulfillment

1. **Hero (split bento)** — left: H1, eyebrow, sub, dual CTA, trust strip (logos as text marks). Right: tall hero render in rounded frame with floating metric chip ("400K+ orders shipped") and live "same-day cutoff" countdown card.
2. **Trust ribbon** — animated marquee of brand-name client mentions / metric pills (no logos required, text-based).
3. **Bento value grid (5 tiles)** — Same-day, QC photo proof, branded unboxing, real-time sync, no-minimums. Each tile mixes copy + a small render or animated SVG diagram.
4. **How it works (4-step horizontal rail)** — Sticky scroll-linked steps with photoreal thumbnails.
5. **Real-time integration tile** — large dark card showing animated order → label → scan → ship pipeline (SVG diagram, not photo).
6. **Performance metrics (bento)** — 4 oversized stat tiles with animated counters: 99.2% same-day, 99.8% accuracy, 24h onboarding, <0.3% error.
7. **Capabilities accordion** — expandable list of services.
8. **Case study spotlight** — single full-bleed dark card with photoreal photo + quote + 3 outcome metrics.
9. **FAQ** — interactive accordion (kept).
10. **Final CTA** — dark navy panel, orange button, secondary "talk to fulfillment lead" link.

## Page Structure — Amazon FBA Prep

1. **Hero (split bento)** — H1 "Amazon FBA prep, engineered for compliance.", FNSKU eyebrow, dual CTA, hero render of pallet/FNSKU pallet, floating "1M+ units prepped" chip + "24h turnaround" pill.
2. **Compliance trust strip** — text marks: FNSKU, Hazmat, Lithium-cert, SFP-ready, Vendor Central.
3. **Bento services grid (6 tiles)** — FNSKU, Polybagging, Bubble wrap, Carton prep, Pallet forwarding, Photo-proof QC. Each tile pairs a render thumbnail with a one-line outcome and "What's included" micro-list.
4. **Process timeline (5 steps)** — vertical sticky scroll with renders 2-5 anchored to steps.
5. **Compliance checklist bento** — 2-col tile of compliance items with animated checks; sidebar tile with "Common Amazon rejections we prevent" list.
6. **Performance metrics bento** — 400K orders/yr, 99.2% on-time, 99.8% accuracy, 1M+ units/yr.
7. **Results snapshot** — 3 industry case tiles (Electronics, Supplements, Toys) with subtle render backgrounds.
8. **Walmart on request** — small dark card.
9. **FAQ accordion** (kept, expanded).
10. **Final CTA** — dark navy panel matching Shopify CTA, distinct headline.

## Implementation

### New components
- `src/components/shopify-channel/v2/HeroBento.tsx`
- `src/components/shopify-channel/v2/TrustMarquee.tsx`
- `src/components/shopify-channel/v2/ValueBento.tsx`
- `src/components/shopify-channel/v2/HowItWorksRail.tsx`
- `src/components/shopify-channel/v2/IntegrationDiagram.tsx`
- `src/components/shopify-channel/v2/MetricsBento.tsx`
- `src/components/shopify-channel/v2/CapabilitiesAccordion.tsx`
- `src/components/shopify-channel/v2/CaseStudySpotlight.tsx`
- `src/components/shopify-channel/v2/FinalCTA.tsx`
- `src/components/amazon/v2/HeroBento.tsx`
- `src/components/amazon/v2/ComplianceStrip.tsx`
- `src/components/amazon/v2/ServicesBento.tsx`
- `src/components/amazon/v2/ProcessTimeline.tsx`
- `src/components/amazon/v2/ComplianceChecklist.tsx`
- `src/components/amazon/v2/MetricsBento.tsx`
- `src/components/amazon/v2/ResultsBento.tsx`
- `src/components/amazon/v2/FinalCTA.tsx`
- `src/components/shared/BentoTile.tsx` — reusable tile primitive (variants: dark, light, render-bg).

Page files `src/pages/ShopifyFulfillment.tsx` and `src/pages/AmazonFBAPrep.tsx` rewritten to compose v2 sections. Old components left in place (unused) so nothing else breaks; can be cleaned up after sign-off.

### Image generation
12 photoreal renders via `imagegen--generate_image` (premium tier for hero shots, standard for the rest), saved to `src/assets/shopify-v2/*.jpg` and `src/assets/amazon-v2/*.jpg`, imported with ES6.

### Tokens
- Add CSS vars: `--surface-navy`, `--surface-navy-2`, `--hairline`, `--orange-glow` in `index.css`.
- Tailwind extension for `shadow-glass` and `bg-grid-faint` utility.

### SEO / structure
- Keep existing `<Helmet>` titles, descriptions, canonicals, structured data on both pages.
- Keep single H1 per page rule.
- Preserve all existing internal links; add new contextual links inside bento tiles (`/why-choose-us`, `/pricing`, `/kitting-bundling`, `/`).
- All new images get descriptive alt text.

### Out of scope
- Header, Footer, Logo, breadcrumbs, ChatBot, sticky mobile CTA — untouched.
- No backend / database / auth changes.
- No copy in other languages beyond `<TranslatedText>` wrapping (kept).

## Verification
- Visual QA at 1440 + 768 + 375 widths via browser screenshots.
- Console + network checks (no broken image imports, no layout shift on hero).
- Confirm single H1, alt text present, FAQ schema still emits.
