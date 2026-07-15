# Reposition Toward 1,000+ Orders/Month (Soft Positioning)

Shift public-facing copy so the site clearly **speaks to brands doing 1,000+ orders/month** as the primary audience — without hard-blocking or turning away smaller brands. Framing is "built for scaling brands, sweet spot 1,000+/mo," not "we require 1,000+."

**Tone rules:**
- ✅ "Built for brands shipping 1,000+ orders/month"
- ✅ "Our sweet spot is 1,000+ orders/mo, and we scale to 50,000+"
- ✅ "Purpose-built for mid-market and scaling ecommerce brands"
- ❌ No "minimum required," "we don't work with under X," or hard gates
- ❌ Drop "no minimums / any size / your first 50 orders" small-brand language

**Leave untouched:** Header, Footer, Logo, all blog posts, ROI calculator, admin/billing UI, backend enums, auth flows.

---

## 1. Homepage

**`src/components/Hero.tsx`**
- "No Minimums" badge → "Built for 1,000+ orders/mo"

**`src/components/ValueProposition.tsx`**
- "No minimums, no commitments. 50 or 50,000 orders" → "Purpose-built for brands shipping 1,000+ orders/month, scaling to 50,000+"
- Stat card "Minimums: 0" → "Sweet spot: 1,000+ orders/mo"

**`src/components/Services.tsx`**
- "From your first 50 orders to full-scale multi-channel distribution" → "Built for brands doing 1,000+ orders/month, scaling to full multi-channel distribution"

---

## 2. Service & Channel Pages

Replace small-brand framing ("at least 100 units," "50 to 50,000+," "any size") with 1,000+ sweet-spot language in:

- `src/pages/Pricing.tsx`
- `src/pages/ThreePLLosAngeles.tsx`
- `src/pages/OrderFulfillment.tsx`
- `src/pages/KittingBundling.tsx`
- `src/pages/InventoryManagement.tsx`
- `src/pages/sales-channels/Shopify.tsx`
- `src/pages/sales-channels/Amazon.tsx`
- `src/pages/ShopifyFulfillment.tsx`

Shopify channel v2 sections:
- `src/components/shopify-channel/ShopifyChannelFAQ.tsx` — rewrite "Do you have minimums?" answer to: no hard minimum, but the platform, pricing, and ops are designed for brands doing 1,000+ orders/mo
- `src/components/shopify-channel/ShopifyChannelValueGrid.tsx`
- `src/components/shopify-channel/ShopifyFinalCTA.tsx`
- `src/components/shopify-channel/ValueBento.tsx`
- `src/components/shopify-channel/TrustMarquee.tsx`
- `src/components/shopify-channel/FinalCTA.tsx`

Amazon:
- `src/components/amazon/WhyLAForFBA.tsx`
- `src/components/amazon/FinalCTA.tsx`

Inventory:
- `src/components/inventory/InventoryFAQ.tsx`
- `src/components/inventory/InventoryStorage.tsx`

---

## 3. Contact Form (silent capture, no gate)

**`src/components/ContactForm.tsx`**
- Remove "Just Starting" from the monthly-volume dropdown
- New tiers: `Under 1,000`, `1,000–5,000`, `5,000–25,000`, `25,000+`
- `Under 1,000` stays as an option — sub-threshold leads still submit and are captured silently. No warning, no decline, no redirect.
- Submit logic and backend unchanged.

---

## 4. Chatbot

**`src/lib/chatKnowledge.ts`** — rewrite the ~5 answers that lean on "any size / no minimums":
- Positioning answers → "built for 1,000+ orders/mo, sweet spot for scaling brands"
- Smaller-brand askers still get a full, helpful answer and are captured — no soft-decline, no redirect.

---

## 5. Platform / Integration Data

**`src/data/platformsData.ts`** and **`src/data/supportedPlatforms.ts`**
- Retag entries currently labeled "Small Businesses / Startups" (e.g., Wix) → "Scaling brands" / "Mid-market" tags.

---

## 6. Generated PDFs

**`src/lib/faqPdfGenerator.ts`**, **`src/lib/fulfillmentGuidePdfGenerator.ts`**
- Rewrite tier and "no minimums / just starting" mentions to 1,000+ sweet-spot framing.

*(Skipping `roiReportPdfGenerator.ts` per your instruction not to touch the calculator.)*

---

## Not Touching
- Header, Footer, Logo (locked per project memory)
- All blog posts (SEO — locked)
- ROI calculator UI + logic
- Admin dashboards, billing labels, quote templates
- Backend enums, DB values, edge functions
- Auth, RLS, security

---

## Verification
After edits, grep for old phrases (`no minimums`, `first 50`, `100 units`, `any size`, `Just Starting`) to confirm nothing public-facing was missed, then screenshot Home hero, Pricing, and Shopify channel page to confirm the new positioning reads correctly.