## ROI Calculator: Deeper 3PL Pricing + SKU & Team Inputs

Enhance `src/components/EnhancedROICalculator.tsx` with smarter 3PL cost modeling, autofill defaults, and two new inputs (SKU count, team size). All new fields default to sensible values so users who just want a quick estimate aren't forced to fill anything out.

### 1. New inputs

Add to `CalcInputs`:
- `skuCount: number` (default 25) — used to nudge storage estimate and complexity tier
- `teamSize: number` (default 1) — number of people currently helping with fulfillment
- Expand 3PL pricing block (shown when fulfillment = `other-3pl` or `hybrid`):
  - `currentPickPackPerOrder` (default 3.50)
  - `currentPerUnitRate` (rename of `currentRatePerUnit`, default 0.75)
  - `currentStoragePerSkuMonthly` (default 2.00) — per active SKU/month
  - `currentMonthlyMinimum` (default 250)
  - An **"Autofill industry averages"** button that one-clicks all four to defaults so users can skip the detail

### 2. Logic updates (`useRoiMath`)

**Team-adjusted time recovery:**
```
timeRecovered = hoursPerWeek × teamSize × 4.33 × hourlyValue × outsourceShare
```
`hoursPerWeek` becomes "hours per person per week"; team size multiplies labor cost being recovered. Cap at `teamSize ≤ 20` and `hoursPerWeek ≤ 60` to keep numbers sane.

**Richer 3PL delta** (replaces flat per-unit comparison):
```
currentMonthly3PLCost =
    monthlyOrders × currentPickPackPerOrder
  + monthlyUnits  × currentPerUnitRate
  + skuCount      × currentStoragePerSkuMonthly
currentMonthly3PLCost = max(currentMonthly3PLCost, currentMonthlyMinimum)

westfieldEquivalent  = monthlyUnits × ourEffectiveRate   (already computed)
threePLDelta         = max(0, currentMonthly3PLCost - westfieldEquivalent) × blendShare
```
- `blendShare` = 1 for other-3pl, 0.5 for hybrid, 0 for self
- Delta clamped at 0 so we never claim savings when Westfield is more expensive
- Cap total monthly savings at `2 × currentMonthly3PLCost` as a sanity guard

**Westfield cost shown** continues to include the multi-unit surcharge; no change for `self` users beyond the team-size time math.

### 3. UI changes

- Add a "Team & catalog" subsection in the inputs column with two compact numeric inputs:
  - "How many SKUs do you stock?" (default 25)
  - "How many people help with fulfillment?" (default 1)
- Replace single "Current 3PL per-unit rate" field with a collapsible "Current 3PL pricing" panel containing the 4 fields above + **Autofill industry averages** button. Panel only renders when fulfillment ≠ self.
- Results card adds a new breakdown row: **"Your current 3PL cost (est.)"** with tooltip showing the formula, plus the existing savings rows now sourced from the new delta math.
- All new fields use `Input type="number"` with `min`/`max` and the same styling as existing inputs. Nothing else in the layout, lead form, PDF flow, or sticky behavior changes.

### 4. Files

- `src/components/EnhancedROICalculator.tsx` — only file edited. Defaults remain so the calculator still works untouched.
- PDF generator (`src/lib/roiReportPdfGenerator.ts`) — add the new fields to the data passed in so the emailed report reflects them. Will inspect on implementation; if signature is generic (object passthrough) no change needed.

### Technical notes

- All new state lives in the existing `inputs` object — no new hooks or context.
- Autofill button just calls `setInputs(prev => ({ ...prev, ...industryDefaults }))`.
- Number formatting keeps `usd()` (whole dollars) for credibility.
- ROI % cap stays at 500%; total savings cap at `2 × currentMonthly3PLCost` (or unchanged when self-fulfillment).
