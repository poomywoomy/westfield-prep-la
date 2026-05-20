## Goal
Make the ROI calculator channel-aware so Amazon FBA inputs match how sellers actually think about prep work (units, not orders), while Shopify keeps order-based inputs. When "Both" is selected, show every field.

## Input changes (in `src/components/EnhancedROICalculator.tsx`)

Add two new fields to `CalcInputs`:
- `monthlyPrepUnits: number` — units sent into FBA per month (default `1000`)
- `avgUnitsPerPreppedItem: number` — units packaged together as one prepped item, e.g. 2-pack bundle (default `1`)

Keep `monthlyOrders` + `avgUnitsPerOrder` as the Shopify/DTC inputs.

### Conditional rendering of the "Volume" section
- `channel === "shopify"` → show only **Monthly orders** + **Avg units per order** (current behavior)
- `channel === "amazon"` → hide DTC fields; show **Monthly units requiring prep** + **Avg units per prepped item** (default 1)
- `channel === "both"` → show all four fields, grouped under small subheaders "Shopify / DTC" and "Amazon FBA"

## Math updates in `useRoiMath`

```text
dtcOrders   = channel ∈ {shopify, both} ? monthlyOrders : 0
dtcUnits    = dtcOrders × avgUnitsPerOrder
fbaPrepEvts = channel ∈ {amazon, both} ? monthlyPrepUnits : 0
fbaUnits    = fbaPrepEvts × avgUnitsPerPreppedItem   // default 1 → equal to prep units
monthlyUnits = dtcUnits + fbaUnits
```

3PL cost model (per channel, so FBA isn't charged a per-order pick/pack rate it doesn't incur):
```text
raw3PL = dtcOrders × currentPickPackPerOrder
       + monthlyUnits × currentPerUnitRate
       + skuCount × currentStoragePerSkuMonthly
```
(Amazon prep is priced per unit by 3PLs, not per order — so we intentionally only multiply pick/pack by DTC orders.)

The multi-unit surcharge on Westfield's effective rate should trigger if **either** `avgUnitsPerOrder > 1` **or** `avgUnitsPerPreppedItem > 1`.

The lead-report payload sent to `send-roi-report` will include the new fields (`monthlyPrepUnits`, `avgUnitsPerPreppedItem`) alongside the existing ones; the edge function tolerates extra fields, so no function change is required.

## UI details
- Field labels use `<TranslatedText>` like the rest of the form.
- Amazon section gets a short helper line: "One prepped item = the bundle you ship to Amazon (e.g. a 2-pack counts as 1 prepped item, 2 units)."
- Defaults so the calc never shows $0 on first render for an Amazon selection: `monthlyPrepUnits: 1000`, `avgUnitsPerPreppedItem: 1`.

## Files touched
- `src/components/EnhancedROICalculator.tsx` (only)

No backend, schema, or PDF generator changes needed.