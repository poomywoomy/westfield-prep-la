# Homepage messaging: Built for large-scale brands

## Goal
Tell homepage visitors Westfield is built for large-scale brands, with reduced (volume-based) shipping prices as the hook. Qualitative claim only — no invented percentages.

## Changes (homepage only)

1. **Hero subline** (`src/components/PremiumHero.tsx`)
   - Replace the closing phrase "Built for 1,000+ orders/month." with "Built for large-scale brands — with volume shipping rates big carriers give only their biggest accounts."
   - Everything else in the hero stays untouched.

2. **New "Built for Scale" section** on the homepage
   - New component `src/components/BuiltForScale.tsx`, lazy-loaded in `src/pages/Index.tsx` between the Stats Strip and the Use Case section (fits the existing dark navy rhythm).
   - Layout: Technical Editorial style consistent with the current homepage (navy bg, orange accent hairlines, single H2).
   - Headline: "Built for large-scale brands." with an orange-italic sub-emphasis word, matching the hero's display style.
   - Body copy: we handle volume that breaks smaller 3PLs, and our shipping volume unlocks carrier rates that get passed straight to the client.
   - Three proof-point cards (qualitative, no fabricated numbers):
     - Volume carrier rates — discounted shipping costs passed through, not marked up
     - Built for throughput — dock-to-ship capacity that scales with order spikes (uses existing 2M+ / 100+ brands stats as evidence)
     - Dedicated account team — direct line, no ticket queues at scale
   - One CTA row: "Get Free Fulfillment Audit" (contact) + "See Pricing".
   - Single H2 on the page rule respected (this section uses H2; hero keeps the only H1).

3. **Consistency touch-up** (`src/components/ValueProposition.tsx`)
   - Small card currently titled "Built for scaling brands" reworded to "Built for large-scale brands" so the new positioning reads consistently; the 1,000+ orders/mo stat line stays as supporting detail.

## Out of scope
- Pricing page, service pages, meta titles, and blog content: unchanged.
- No new numbers/percentages invented for shipping savings.

## Notes
- After approval, project memory's positioning note ("1,000+ orders/month" soft positioning) will be updated to the "large-scale brands" homepage positioning.
- Build verified via dev-server build log and a quick render check of the homepage.
