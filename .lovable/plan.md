## Changes to `src/components/EnhancedROICalculator.tsx`

### 1. Pricing updates
- `currentFbaPrepPerUnit` default: `0.85` → **`1.40`**
- Industry autofill default for FBA prep: also **`1.40`**
- **Remove storage entirely** from the 3PL pricing model:
  - Remove `currentStoragePerSkuMonthly` (DTC per-SKU storage) field, input, autofill, and math
  - Remove `currentFbaStoragePerUnitMonthly` field, input, autofill, and math
  - Remove `skuCount` from cost math (it was only used for storage)
  - Update formula breakdown tooltip to drop storage lines
  - Remove storage fields from the `send-roi-report` payload

Resulting math:
```
dtc3PLCost = dtcOrders × pickPackPerOrder + dtcUnits × perUnitRate
fba3PLCost = fbaUnits × fbaPrepPerUnit
rawCurrent3PL = (includeDtc ? dtc3PLCost : 0) + (includeFba ? fba3PLCost : 0)
```

### 2. Visual interactivity pass (UI only, no logic changes)
Goal: make the calculator feel premium, animated, and engaging instead of a flat form.

- **Animated step indicator**: gradient progress bar with shimmer; step pills scale + glow when active using `framer-motion`.
- **Card polish**: glassmorphism (`backdrop-blur`, gradient border, soft shadow), Midnight Navy → Orange accent gradients on key surfaces, subtle floating orbs in the background.
- **Channel selector**: large icon tiles (Shopify / Amazon / Both) with hover lift, selected state pulses in brand orange, animated check.
- **Inputs**: focus-ring in orange, `motion` fade/slide as fields appear when channel changes, animated number counters where values display.
- **Live results card**: 
  - Big animated count-up for monthly + annual savings (CountUp-style with `motion`).
  - Animated horizontal "savings vs current" comparison bar.
  - ROI %, payback period, and "you save" chips with stagger animation on mount.
- **Volume/simplicity discount callout**: keep copy, restyle as a glowing orange-bordered banner with an arrow icon that nudges on hover.
- **Micro-interactions**: button hover scale, tooltip fades, section reveal on scroll via `whileInView`.
- All styling via existing semantic tokens (Midnight Navy `#0A0A23`, Orange `#FF7A00`) — no hardcoded colors, no header/footer/logo changes.

### Out of scope
- No backend, schema, or edge function changes beyond removing storage fields from the email payload.
- No changes to other pages/components.
