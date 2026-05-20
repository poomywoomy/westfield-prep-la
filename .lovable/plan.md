## Goal
Differentiate the "current 3PL pricing" inputs based on selected channel (FBA prep 3PLs price per unit, not per order) and add a callout telling visitors to reach out for deeper volume or simplicity discounts.

## 1. Channel-specific 3PL pricing inputs

Extend `CalcInputs` in `src/components/EnhancedROICalculator.tsx`:
- `currentFbaPrepPerUnit: number` — typical FBA prep fee per unit (default `0.85`)
- `currentFbaStoragePerUnitMonthly: number` — per-unit storage at current FBA prep 3PL (default `0.15`)

Keep the existing DTC-oriented fields (`currentPickPackPerOrder`, `currentPerUnitRate`, `currentStoragePerSkuMonthly`, `currentMonthlyMinimum`) — those represent the Shopify/DTC 3PL side.

Update `industry3PLDefaults` and `defaultInputs` to include the two new fields.

### Render rules (inside the existing 3PL pricing panel, only shown when `fulfillment !== "self"`):
- `channel === "shopify"` → show DTC fields only (current behavior).
- `channel === "amazon"` → hide pick/pack-per-order and per-SKU storage; show:
  - Current FBA prep fee per unit
  - Current FBA storage per unit / month
  - Monthly minimum (kept, since FBA prep 3PLs also have minimums)
- `channel === "both"` → show both groups under subheadings "Shopify / DTC 3PL" and "Amazon FBA prep 3PL".

The "Autofill industry averages" button populates whichever fields are visible.

## 2. Math update in `useRoiMath`

Replace the single `rawCurrent3PL` formula with a sum of the two channel-specific costs:

```text
dtc3PLCost = dtcOrders × currentPickPackPerOrder
           + dtcUnits   × currentPerUnitRate
           + skuCount   × currentStoragePerSkuMonthly        // only if includeDtc

fba3PLCost = fbaUnits × currentFbaPrepPerUnit
           + fbaUnits × currentFbaStoragePerUnitMonthly       // only if includeFba

rawCurrent3PL = (includeDtc ? dtc3PLCost : 0) + (includeFba ? fba3PLCost : 0)
current3PLMonthly = fulfillment === "self" ? 0 : max(rawCurrent3PL, currentMonthlyMinimum)
```

The existing "3PL fee delta vs Westfield" and 2× sanity cap logic stays unchanged.

The breakdown formula string in the results card is updated to reflect whichever channel(s) are active, so it stays auditable.

## 3. Volume / simplicity discount callout

Add a small note directly under the results card (or under the "Email me this report" CTA) with the brand orange accent:

> "Doing higher volume or just one simple SKU? Reach out — we offer deeper volume discounts and simplicity pricing that isn't reflected here."

Wrap the link to `/contact` in a subtle inline anchor. Use `<TranslatedText>` for the copy.

## 4. Payload
Add `currentFbaPrepPerUnit` and `currentFbaStoragePerUnitMonthly` to the `send-roi-report` body alongside the existing pricing fields. Edge function tolerates extra fields, no function change needed.

## Files touched
- `src/components/EnhancedROICalculator.tsx` (only)