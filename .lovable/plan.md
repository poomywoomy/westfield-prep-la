

## Plan: Pallet-Based Minimum Spend with Customizable Intro Period

### Goal
Update the Master Agreement contract and Quote PDF so the minimum-spend section:
1. States that the **monthly minimum is dictated by the stored pallet amount**.
2. Keeps all existing presets (`$250→$500`, `$500 flat`, `$1,000 flat`).
3. Adds a new **"Custom Tier"** option where you enter **two separate numeric fields**:
   - **Intro period amount** (optional — months 1–3)
   - **Ongoing amount** (required — month 4+)
4. If the intro field is left blank, the contract/quote shows **only** the flat ongoing amount with no intro-period language.

### Where the change lives
Same two surfaces as before — both already share an encoded `minimumSpendTier` string:
- **Quote builder:** `src/components/admin/CreateQuoteDialog.tsx` → `src/lib/quotePdfGenerator.ts`
- **Contract generator:** `src/components/admin/DocumentGeneratorTab.tsx` → `src/lib/documentGenerator.ts`

### Encoding (no DB migration)
We extend the existing `custom:` convention so the `minimum_spend_tier text` column keeps working unchanged:

```
custom:750              → flat $750/mo, no intro period
custom:500_then_1000    → $500/mo for 3 months, then $1,000/mo
```

Existing values (`250_then_500`, `500`, `500_flat`, `1000`, `1000_flat`) keep working unchanged. Old saved documents/quotes regenerate identically.

### UI changes (both dialogs)

The "Custom Amount (enter $)" option becomes **"Custom Tier (intro + ongoing)"**. When selected, two numeric inputs appear instead of one:

```
┌─ Minimum Monthly Spend ───────────────────┐
│ [ Custom Tier (intro + ongoing)      ▼ ]  │
│                                           │
│ Intro Period Amount ($) — optional        │
│ [ e.g. 500          ]                     │
│ Leave blank for no intro period.          │
│                                           │
│ Ongoing Amount ($) — required after 3 mo  │
│ [ e.g. 1000         ]                     │
│ Whole dollars only. Numerical characters. │
└───────────────────────────────────────────┘
```

- Both inputs strip non-numeric characters on change (`/[^0-9]/g`) — typo-safe.
- Generate button stays disabled until **Ongoing** is a valid whole number ≥ 1.
- Intro field is purely optional; empty = flat tier.

### PDF text changes

**Both PDFs** get a new opening sentence in the minimum-spend block:

> *"The minimum monthly payment is dictated by the stored pallet amount."*

Then the tier-specific text follows.

**`src/lib/documentGenerator.ts` — Section 5.5**

Extended `custom:` parser handles both shapes:

```ts
// custom:1000              → flat
// custom:500_then_1000     → intro + ongoing
if (tier.startsWith("custom:")) {
  const payload = tier.slice(7);
  const palletPrefix = "The minimum monthly payment is dictated by the stored pallet amount. ";

  if (payload.includes("_then_")) {
    const [intro, ongoing] = payload.split("_then_").map(n => parseInt(n, 10));
    if (intro >= 1 && ongoing >= 1) {
      tierText = palletPrefix +
        `For the first three (3) months following the Effective Date, the minimum payment shall be ${numberToWords(intro)} U.S. Dollars ($${intro.toLocaleString("en-US")}) per month. Following this initial three-month period, the minimum payment requirement shall increase to ${numberToWords(ongoing)} U.S. Dollars ($${ongoing.toLocaleString("en-US")}) per month.`;
    }
  } else {
    const amount = parseInt(payload, 10);
    if (amount >= 1) {
      tierText = palletPrefix +
        `Client agrees to a minimum monthly payment of ${numberToWords(amount)} U.S. Dollars ($${amount.toLocaleString("en-US")}) per month for the Services.`;
    }
  }
}
```

The pallet-prefix sentence is **also prepended** to all preset tiers (`250_then_500`, `500_flat`, `1000_flat`) so every contract — preset or custom — opens with the pallet language.

**`src/lib/quotePdfGenerator.ts` — `getMinimumSpendText`**

Same logic, plus the pallet prefix is added to every entry in `MINIMUM_SPEND_TEXT` and the custom branches.

### History display

`DocumentGeneratorTab.tsx` `formatMinimumTierLabel()` extended:

```
custom:750              → "$750/mo flat (custom)"
custom:500_then_1000    → "$500/mo for 3 mo, then $1,000/mo (custom)"
```

Regenerate-from-history works because the encoded string round-trips cleanly.

### Files affected
- **Edit** `src/components/admin/CreateQuoteDialog.tsx` — split custom input into intro + ongoing, validate ongoing required, encode as `custom:N` or `custom:N_then_M`.
- **Edit** `src/components/admin/DocumentGeneratorTab.tsx` — same UI split + same encoding + extend `formatMinimumTierLabel`.
- **Edit** `src/lib/documentGenerator.ts` — prepend pallet sentence to all tier text; parse `custom:N_then_M`.
- **Edit** `src/lib/quotePdfGenerator.ts` — prepend pallet sentence to all tier text; parse `custom:N_then_M`.

### Out of scope
- No DB schema changes (existing `minimum_spend_tier text` column accepts the new shape).
- No changes to One-Time Project Quote dialog (no minimum spend by design).
- No decimals/cents — whole dollars only.
- The intro period stays fixed at 3 months (matches all existing presets and current legal language).

