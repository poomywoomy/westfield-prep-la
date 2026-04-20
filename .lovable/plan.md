

## Plan: Add a "Custom Amount" Option to the Minimum Monthly Spend

### Goal
Keep the three existing minimum-spend presets ($250 → $500, $500 flat, $1,000 flat) and add a fourth **"Custom Amount"** option. When selected, a numeric-only input appears so you can type any dollar value (e.g. `750`, `1500`, `2500`). The custom number flows correctly into both:
- **Quote PDFs** (`quotePdfGenerator.ts`)
- **Master Agreement PDFs** (`documentGenerator.ts` Section 5.5)

### Where it appears
Both places that currently show the minimum-spend dropdown will get the new option:
1. **Create Quote dialog** (`src/components/admin/CreateQuoteDialog.tsx`) — for prospect/recurring quotes.
2. **Document Generator tab** (`src/components/admin/DocumentGeneratorTab.tsx`) — for the Master Agreement contract.

The existing 3 presets stay exactly as they are.

### Behavior

1. Dropdown gets a new entry: **"Custom Amount (enter $)"**.
2. When selected, a numeric `<Input>` appears directly below the dropdown:
   - `inputMode="numeric"`, `pattern="[0-9]*"`
   - `onChange` strips anything that isn't `0–9` before updating state (typo-proof — letters, symbols, spaces, decimals are ignored)
   - Min value 1; empty input blocks PDF generation with a toast
   - Helper text: "Whole dollars only. Numerical characters."
3. Generate button stays disabled until a valid custom number is entered (when "Custom Amount" is selected).

### Data flow

We'll encode the custom value inside the same `minimumSpendTier` string field — no DB migration needed. Format:

```
"custom:750"   →  $750/mo flat
"custom:1500"  →  $1,500/mo flat
```

Existing values (`250_then_500`, `500`, `500_flat`, `1000`, `1000_flat`) keep working unchanged. Old saved documents/quotes regenerate identically.

### PDF rendering changes

**`src/lib/quotePdfGenerator.ts`** — replace the static `MINIMUM_SPEND_TEXT` lookup with a helper:
```ts
function getMinimumSpendText(tier: string): string | null {
  if (tier.startsWith("custom:")) {
    const amount = parseInt(tier.slice(7), 10);
    if (!amount || amount < 1) return null;
    const formatted = amount.toLocaleString("en-US");
    return `Client agrees to a minimum monthly service spend of $${formatted}.00 per month. Shipping costs, carton usage fees, and polybag usage fees are excluded from this calculation.`;
  }
  return MINIMUM_SPEND_TEXT[tier] ?? null;
}
```

**`src/lib/documentGenerator.ts`** — extend `getSection5_5()` with the same `custom:` branch, producing properly worded legal text:
> *"Client agrees to a minimum monthly payment of [Amount in Words] U.S. Dollars ($X,XXX) per month for the Services."*

The amount is also written out in words for legal clarity (e.g. `$750` → "Seven Hundred Fifty U.S. Dollars ($750)") using a small `numberToWords` helper added to `documentGenerator.ts`.

### History/regenerate

`DocumentGeneratorTab` history table already shows the tier label. We'll update the lookup so `custom:NNN` displays as `"$750/mo flat (custom)"` in the table and regenerates correctly.

### Files affected

- **Edit:** `src/components/admin/CreateQuoteDialog.tsx` — add "Custom Amount" select item + numeric input + validation.
- **Edit:** `src/components/admin/DocumentGeneratorTab.tsx` — same additions; update history-display lookup.
- **Edit:** `src/lib/quotePdfGenerator.ts` — helper for `custom:` tier; wire into the callout-box renderer.
- **Edit:** `src/lib/documentGenerator.ts` — helper for `custom:` tier in Section 5.5 + small `numberToWords()` util.

### Out of scope
- No DB migration (existing `minimum_spend_tier text` column already accepts `custom:NNN`).
- No changes to the One-Time Project Quote dialog (it has no minimum spend by design).
- No decimals/cents in custom amounts — whole dollars only, per typo-safety requirement.

