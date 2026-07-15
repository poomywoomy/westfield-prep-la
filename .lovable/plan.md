# Remove All "No Monthly Minimums" Language

Strip every public-facing statement that we don't have minimums. Replace with "built for 1,000+ orders/mo" positioning, or delete the line entirely where it adds no value.

## Edits

**`src/components/PremiumHero.tsx`** (line 83)
- "…Transparent pricing. No monthly minimums." → "…Transparent pricing. Built for 1,000+ orders/month."

**`src/components/FAQAccordion.tsx`** (lines 12, 19)
- Q "Do you have minimum order requirements?" answer → "We're purpose-built for brands shipping 1,000+ orders per month, scaling to 50,000+. No hard cap on either end — pricing scales with your volume, so you only pay for what you use."
- Line 19: drop "Plus, we don't require minimums — we're built for growing brands at every stage." → replace with "Plus, we're purpose-built for scaling brands doing 1,000+ orders per month."

**`src/components/ShopifyFinalCTA.tsx`** (line 65)
- "Same-day receiving • 24-48hr turnaround • No order minimums" → "Same-day receiving • 24-48hr turnaround • Built for 1,000+ orders/mo"

**`src/components/shopify-channel/v2/TrustMarquee.tsx`** (line 10)
- "No order minimums" → "Built for 1,000+ orders/mo"

**`src/components/kitting/KittingContent.tsx`** (line 14)
- Answer rewritten: "Built for scaling brands. We assemble runs from 1,000 up to 100,000+ kits, with pricing that scales to your volume."

**`src/pages/sales-channels/Shopify.tsx`** (line 55)
- Strip "No hard minimums and" prefix → "No long-term contracts, and we're built for Shopify brands doing 1,000+ orders per month…"

**`src/pages/Pricing.tsx`**
- Line 111 answer: remove "with no monthly minimums" → "…flexible pricing starting at $1.00/unit, built for brands doing 1,000+ orders per month. You get dedicated support and 24-hour turnaround at a fraction of the cost."
- Line 114 question: "Are there any setup fees or minimums?" → "Are there any setup fees or contracts?"
- Lines 718–738 comparison-table "Monthly Minimums" row: delete entire row (removes the "we have none vs $3K+" claim).

**`src/pages/WhyChooseUs.tsx`** (lines 827–830)
- Rewrite FAQ:
  - Q: "What kind of brands do you work with?"
  - A: "We're purpose-built for scaling ecommerce brands shipping 1,000+ orders per month, up to 50,000+. Our platform, pricing, and operations are designed around that volume band. We also carry a $250 monthly storage and account minimum to ensure we can dedicate resources to your account — easily met by active sellers."

**`src/lib/fulfillmentGuidePdfGenerator.ts`** (line 284)
- "No unreasonable minimums" → delete this bullet.

## Not Touching
- `documentGenerator.ts` / `quotePdfGenerator.ts` — `minimumSpendTier` is internal quote generation logic (admin-facing), not public marketing.
- Header, Footer, Logo, blogs, ROI calculator, admin/client dashboards, backend enums.

## Verify
`rg -i "no minimum|monthly minimum|order minimum|no.*minimums"` across `src/` (excluding blog/admin/client) returns nothing in public-facing files.