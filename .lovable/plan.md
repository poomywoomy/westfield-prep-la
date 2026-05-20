## 1. Remove the placeholder logo strip

Delete the "Trusted by Growing Brands" section (with the gray `Logo 1…Logo 6` boxes) in two places:

- `src/pages/Pricing.tsx` — section at lines ~957–986
- `src/components/EnhancedROICalculator.tsx` — block at lines ~2064–2080 inside the results screen

No replacement section. The "Why Our Clients Choose Us" / testimonials below already carry the social proof.

## 2. Redesign the ROI calculator: single page, live, justifiable numbers

Replace the 6-step wizard with a **single-page Stripe-style calculator**: inputs on the left, a sticky results card on the right that updates live as the user types or drags sliders. No "Next" buttons, no progress bar, no PDF-gated lead capture mid-flow.

### Layout (desktop)

```text
+----------------------------------------------------+
|  Your situation                | Your monthly      |
|  --------------------------    | savings with us   |
|  Channel:   [Shopify|FBA|Both] |  $ X,XXX  /mo     |
|  Monthly orders:  [____]       |  $ XX,XXX /yr     |
|  Avg units / order: [____]     |                   |
|                                | Breakdown:        |
|  Current fulfillment:          |  3PL fee delta    |
|   ( ) Self-fulfilling          |  Time recovered   |
|   ( ) Another 3PL  -> rate $   |  Errors avoided   |
|   ( ) Hybrid                   |                   |
|                                | Your est. cost    |
|  Hours/week on fulfillment: [] |  with Westfield   |
|  Hourly value: [$25]           |  $ X,XXX /mo      |
|                                |                   |
|  Error rate %: [slider]        | [Get a quote ->]  |
|  Return rate %: [slider]       |                   |
+----------------------------------------------------+
```

Mobile: inputs stack; results card pins to the bottom of the viewport.

### Inputs (only what we actually use in math)

1. Channel mix — Shopify / Amazon FBA / Both
2. Monthly orders + avg units per order (drives monthly units)
3. **Current fulfillment method** — drives the savings path:
   - **Self-fulfilling** → savings come from time recovered + error/return reduction only (no 3PL delta)
   - **Another 3PL** → reveal a "current per-unit rate" or "current per-order rate" input and compute the **delta vs. Westfield's tiered rate**
   - **Hybrid** → blend: ask what % is outsourced today
4. Hours/week spent on fulfillment today + hourly value (default $25, editable)
5. Error rate % and return rate % (sliders, capped 0–10%)

Lead capture (name / email / company / phone) becomes a **secondary panel below the calculator** with a single "Email me this report" CTA — never a hard gate to seeing numbers.

### Savings math — realistic and itemized

Every line in the results card has a tooltip showing the formula and the inputs it used, so the total is auditable. All components are clamped so output stays credible.

- **3PL cost delta** (only when "Another 3PL" is selected):
  `max(0, (currentPerUnitRate - westfieldRate) × monthlyUnits)`
  If `currentPerUnitRate ≤ westfieldRate`, this line shows `$0` with a note "Your current 3PL is already competitive."
- **Time recovered** (self/hybrid only):
  `hoursPerWeek × 4.33 × hourlyValue × outsourceShare`
  where `outsourceShare = 1.0` for self, `0.5` for hybrid, `0` for 3PL.
- **Errors avoided**:
  `monthlyUnits × errorRate% × $8/error` (industry-standard cost-to-fix, down from $18 — more defensible)
  Hard cap at `monthlyUnits × 2%` so a user typing 10% doesn't produce fantasy savings.
- **Returns processed cheaper**:
  `monthlyUnits × returnRate% × $4/return` (delta we save vs. self-processing, not full return cost)

**Westfield estimated cost** (shown separately, not subtracted twice):
Existing volume tiers from `EnhancedROICalculator.tsx` — keep them, just expose the rate next to the number.

**Total monthly savings** = sum of the four components above.
**Annual** = `monthly × 12`.
**ROI %** = `(monthlySavings / estimatedMonthlyCost) × 100`, capped at 500% display ("500%+" past that — beyond is not credible for fulfillment).

### What gets removed from the current flow

- Multi-step state machine, `currentStep`, `Next/Back` buttons, progress bar
- "Business stage", "revenue range", "SKU count", "product type", "pain points", "services needed", "special requirements" — none feed the math; move to the quote form on `/contact` instead
- PDF generation stays available but moves behind the "Email me this report" CTA (unchanged backend: `send-roi-report` edge function, `roiReportPdfGenerator.ts`)

### Files touched

- `src/components/EnhancedROICalculator.tsx` — rewritten as single-page component; old wizard code deleted. Math helpers extracted to a small `useRoiMath` hook in the same file for clarity.
- `src/pages/Pricing.tsx` — remove the logo-placeholder section; nothing else changes (the `<EnhancedROICalculator variant="pricing" />` mount stays where it is).

### Out of scope (this pass)

- No backend changes, no schema changes, no edge-function changes.
- PDF template stays as-is; only the inputs it receives get trimmed.
- Translations: keep `TranslatedText` wrappers on every visible string, same pattern as today.

## Tech notes

- Reuse shadcn `Input`, `Slider`, `RadioGroup`, `Tooltip`, `Card`.
- Use `useMemo` for math so every keystroke is cheap.
- Sticky results card: `lg:sticky lg:top-24` on the right column.
- Number formatting: `Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })` for dollars; never show cents in the results card.
- Keep the existing `trackEvent('roi_calculator_started' | 'roi_calculator_completed')` calls; fire `completed` once the email-report CTA is clicked.