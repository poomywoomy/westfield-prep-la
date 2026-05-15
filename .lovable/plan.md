# Bind Old Content into New Bento Pages

Both `/sales-channels/shopify` and `/sales-channels/amazon` look strong visually, but they lost the long-form, SEO-rich copy and internal links from the previous versions. Plan: keep the new bento layout intact and graft the old text depth back in as new prose-heavy sections, plus thicken some existing tiles.

## Goals
- Preserve the new bento aesthetic, colors, hero, and image tiles.
- Restore the explanatory paragraphs, service descriptions, internal links, FAQs (extended), and trust copy from the legacy components.
- Keep H1 single per page, use semantic tokens, wrap visible English in `TranslatedText`.

## Shopify page (`src/pages/sales-channels/Shopify.tsx`)

Insert two new prose-heavy sections and extend a couple of existing tiles. Final order:

```
HeroBento
TrustMarquee
ValueBento                ← extend tiles with longer descriptions
+ NEW: ServicesDeepDive   ← 6 detailed services from old ShopifyChannelServices (with internal links)
HowItWorksRail            ← add intro paragraph + per-step descriptions
IntegrationDiagram        ← add intro/outro paragraphs from old Integration component
MetricsBento
CapabilitiesAccordion
+ NEW: WhyLAEdge          ← LA port-proximity + DTC narrative pulled from old Hero/CaseStudy
CaseStudySpotlight        ← add fuller quote + outcome bullets
FaqSection                ← already 7 Qs, expand answers with old detail
FinalCTA
```

New components (built in the v2 visual language — navy surface, orange accents, hairline borders, BentoTile primitive where it fits, but allowed to be prose blocks for readability):
- `src/components/shopify-channel/v2/ServicesDeepDive.tsx` — 6 service cards (Pick & Pack, Custom Branding & Kitting, Multi-Carrier Shipping, Returns Management, Photo QC, Inventory Storage), each with the full paragraph and the keyword-rich link from the old `ShopifyChannelServices`.
- `src/components/shopify-channel/v2/WhyLAEdge.tsx` — two-column prose section explaining LA port advantage, DTC focus, transparent pricing, dedicated approach. Internal links to `/why-choose-us`, `/pricing`, `/storage-warehousing`, `/kitting-bundling`.

Edits to existing v2 components:
- `ValueBento.tsx`: lengthen the 5 tile descriptions (carry over phrasing from old `ValueGrid`/`Hero` trust points).
- `HowItWorksRail.tsx`: add a section intro paragraph and a one-sentence description per step.
- `IntegrationDiagram.tsx`: add intro + outro copy describing real-time, two-way sync and webhook-driven inventory.
- `CaseStudySpotlight.tsx`: add fuller customer-quote paragraph and 3 outcome bullets from old `ShopifyChannelCaseStudy`.
- FAQ array in `Shopify.tsx`: expand each `answer` to the longer copy from old `ShopifyChannelFAQ`.

## Amazon page (`src/pages/sales-channels/Amazon.tsx`)

Same approach. Final order:

```
HeroBento
ComplianceStrip
ServicesBento             ← extend tile copy
+ NEW: ServicesDeepDive   ← FNSKU, Polybagging, Bundling, Carton/Pallet, Hazmat, SFP/Vendor Central
ProcessTimeline           ← add intro + per-step descriptions
ComplianceChecklist       ← add intro paragraph
MetricsBento
+ NEW: WhyLAForFBA        ← LA port + IPI + placement-fee narrative, internal links
ResultsBento              ← add fuller case-study copy
FaqSection                ← expand 8 answers
FinalCTA
```

New components:
- `src/components/amazon/v2/ServicesDeepDive.tsx` — 6 detailed FBA prep services with paragraphs + links to `/labeling-compliance`, `/kitting-bundling`, `/storage-warehousing`, `/pricing`, `/contact`.
- `src/components/amazon/v2/WhyLAForFBA.tsx` — LA-port FBA narrative, IPI score impact, placement-fee strategy, internal links to `/amazon-fba-prep`, `/why-choose-us`, `/pricing`.

Edits to existing v2 components:
- `ServicesBento.tsx`, `ProcessTimeline.tsx`, `ComplianceChecklist.tsx`, `ResultsBento.tsx`: thicker descriptions sourced from the legacy `AmazonChannel*` components.
- FAQ array in `Amazon.tsx`: longer answers.

## Source-of-truth mapping

Legacy files to mine for copy (do **not** import them — copy text only, keep them on disk for reference):
- Shopify: `ShopifyChannelHero.tsx`, `ShopifyChannelServices.tsx`, `ShopifyChannelValueGrid.tsx`, `ShopifyChannelIntegration.tsx`, `ShopifyChannelTimeline.tsx`, `ShopifyChannelCaseStudy.tsx`, `ShopifyChannelFAQ.tsx`, `ShopifyChannelCTA.tsx`.
- Amazon: `AmazonChannelHero.tsx`, `AmazonChannelServices.tsx`, `AmazonChannelValueGrid.tsx`, `AmazonChannelTimeline.tsx`, `AmazonChannelMetrics.tsx`, `AmazonChannelCaseStudy.tsx`, `AmazonChannelFAQ.tsx`.

## Constraints honored

- Header, Footer, Logo untouched.
- Single H1 per page (existing HeroBento h1 stays the only h1; new sections use h2/h3).
- All colors via existing semantic tokens (`--surface-navy`, `--orange-glow`, `--hairline`, `--ink`).
- All visible English wrapped in `TranslatedText`.
- Internal links use `<Link>` from `react-router-dom`, kebab-case routes, no trailing slash.
- No backend, schema, or auth changes.

## Out of scope
- New imagery (reuse the 12 existing v2 photos).
- Redesigning hero/marquee/metrics layouts.
- Header/Footer/Logo/StickyMobileCTA/ChatBot.
- TikTok page.

## Deliverable
Two pages that keep the new bento polish but read as authoritative, SEO-deep landing pages — matching the prior text density while looking like the new design.
