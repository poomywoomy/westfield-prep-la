

## Plan: Add Dynamic Contract Options with Shipping/Materials Exclusion

### Summary
Implement the two dropdown selectors (minimum spend tier + setup fee refundable/non-refundable) and add a new Section 5.5 (Minimum Monthly Payments) that explicitly excludes shipping costs and carton/polybag usage from the minimum fee calculation.

### Changes

**1. Database Migration**
Add two columns to `generated_documents`:
- `minimum_spend_tier` (text, nullable)
- `setup_fee_refundable` (boolean, nullable, default false)

**2. Update `src/lib/documentGenerator.ts`**

- Add `minimumSpendTier` and `setupFeeRefundable` to `ClientDetails` interface
- Convert static `content` to a function that builds the contract dynamically

**Section 5.1 variations:**
- **Refundable**: "...a one-time account setup fee of Five Hundred U.S. Dollars ($500)...fully refundable upon the termination of this Agreement, provided that Westfield reserves the right to deduct any outstanding balances, late fees, or product removal fees (as outlined in Section 14.2) from this refund prior to disbursement."
- **Non-Refundable**: "...a one-time, non-refundable account setup fee of Five Hundred U.S. Dollars ($500)..."

**New Section 5.5 (Minimum Monthly Payments) -- all 3 tiers include this exclusion clause:**

> "For the avoidance of doubt, shipping fees, carton usage fees, and polybag usage fees are not inclusive of, and shall not be credited toward, the minimum monthly payment requirement. These charges are billed separately based on actual usage."

Tier-specific opening text:
- **$250 then $500**: "Client agrees to a minimum monthly payment...Two Hundred Fifty U.S. Dollars ($250) per month for the first three (3) months...increasing to Five Hundred U.S. Dollars ($500) per month thereafter..."
- **$500 flat**: "Client agrees to a minimum monthly payment of Five Hundred U.S. Dollars ($500)..."
- **$1,000 flat**: "Client agrees to a minimum monthly payment of One Thousand U.S. Dollars ($1,000)..."

Each ends with: "If the actual fees for Services rendered in any given month fall below the applicable minimum threshold, Client will be billed the difference."

**Section 14 variations:**
- **Refundable**: includes 14.1 (Notice/Breach) and 14.2 (Post-Termination Removal Fee with "or deducted from the refundable setup fee" language)
- **Non-Refundable**: same but without the deduction mention

**3. Update `src/components/admin/DocumentGeneratorTab.tsx`**
- Add "Agreement Options" section with two Select dropdowns
- Both required before generating
- Pass values to `generateDocumentPDF` and save to history table

### What Stays the Same
- All PDF branding, logo, fonts, signature blocks
- All other 16 sections of the agreement
- Document history functionality

