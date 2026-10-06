# Site-Wide Information Consistency Audit & Fixes

## Goal
Eliminate conflicting facts across the website so every page, PDF, chatbot answer, and schema tells the same story.

## Confirmed mismatches and fixes

### 1. Order volume stats — standardize on "2M+ orders"
- `ShopifyTrustBar.tsx` says "400,000+ Orders Fulfilled" and the Shopify sales-channel meta says "400K+ orders fulfilled" — update both to 2M+ to match the homepage hero, FinalCTA, BuiltForScale, and LocationShowcase.

### 2. Accuracy stat — standardize on 99.8%
- `HowItWorksProcess.tsx` says 99.9% order accuracy → change to 99.8%.
- `faqPdfGenerator.ts` says 99.5% on-time ship rate → align wording to 99.8% accuracy.
- Keep 99.2% only where it is explicitly labeled "Same-Day Ship Rate" (ShopifyTrustBar, ShopifyMetrics) since it measures something different.

### 3. Positioning — replace "boutique" with high-touch-at-scale wording
- `why-choose-us.tsx` meta descriptions and service schema say "boutique service" → reword to personal, high-touch service built for scaling brands.
- `chatKnowledge.ts` (5+ answers), `faqPdfGenerator.ts`, and `faqSchemas.ts` call Westfield a "boutique prep center… faster than large-scale centers" → reword to high-touch service at scale, consistent with the 1,000+ orders/month positioning.

### 4. Pricing figures — align meta copy with the new rate card
- `routes/pricing.tsx` meta/OG and `pageSchemas.ts` say "$1.00–$2.50 per unit"; `Pricing.ts` FAQ says "starting at $1.00/unit". The ROI calculator and quote builder now use $1.70–$2.85 pick & pack tiers. Update the meta/FAQ copy to match the real tier range so Google snippets and pages agree.

### 5. Minimum volume claims
- `OrderFulfillment.ts` FAQ says "at least 100 orders per month" → update to the 1,000+ orders/month sweet-spot wording used everywhere else.
- `llms.txt`/`llms-full.txt` blog blurb says "no minimums" and "(2025)" → refresh those entries.

### 6. Address / ZIP in structured data
- `StructuredData.tsx` and `pageSchemas.ts` LocalBusiness schema list postalCode 91010 (a Duarte ZIP) while all branding says Los Angeles, CA → drop the postalCode from schema (SAB-compliant) so nothing contradicts the LA branding. The shipping-zone-map PDF keeps 91010 intentionally as the warehouse origin ZIP you requested.

### 7. Email addresses
- `fulfillmentGuidePdfGenerator.ts` uses hello@westfieldprepcenter.com and `ContactSupportDialog.tsx` shows admin@westfieldprepcenter.com → standardize both to info@westfieldprepcenter.com. (ScannerHelpDialog's support@westfield3pl.com is an internal admin tool — flag it, change only if you want.)

### 8. Turnaround wording
- Homepage OG says "24-hour turnaround" while the hero badge says "24-48hr Turnaround" → make both say the same thing (24-hour turnaround, same-day before 2 PM PT cutoff stays as-is).

## Out of scope
- No design, layout, header/footer/logo changes. No blog content rewrites. No publishing without your go-ahead.

## Verification
- Re-grep all changed values to confirm zero stragglers, run the build, and spot-check the affected pages (home, pricing, Shopify, why-choose-us, order-fulfillment) in the browser.
