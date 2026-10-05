# ROI calculator + quote form pricing update

## 1. ROI calculator fix
- When "Another 3PL" is selected, hide "People helping with fulfillment" (it is not used for that option anyway). It stays visible for "We do it ourselves" and "Hybrid".

## 2. New pick & pack pricing (per order, by monthly orders)
| Monthly orders | Single item order | Bundle fee (once per multi-item order) |
| --- | --- | --- |
| 0–500 | $2.85 | +$0.70 |
| 501–1,000 | $2.45 | +$0.45 |
| 1,001–5,000 | $1.90 | +$0.35 |
| 5,000+ | $1.70 | +$0.25 |

- Pricing is now per order, not per unit.
- Average units per order splits orders into single and bundle orders. Example: 10 orders at 1.5 avg → 5 single orders, 5 bundle orders. Rule: bundle share = (avg units − 1), capped at 100%. So 2+ avg units means every order is a bundle.
- Bundle fee is charged once per order no matter how many extra items (a 10-item order pays one bundle fee).

## 3. Returns
- Add a "Returns per month" number field to the ROI form (replaces the return rate slider).
- Returns handling is a flat $1.00 per return, added to the Westfield estimate and shown in the cost breakdown and emailed report.

## 4. Quote form (admin Create Quote)
- Monthly Order Volume options become: 0–500 (default), 501–1,000, 1,001–2,500, 2,501–5,000, 5,001–10,000, 10,000+.
- Choosing a volume auto-fills prices on existing and new line items:
  - Single Product → tier price above
  - Bundling → tier bundle fee above
  - Returns and Removal Order Handling → $1.00
- 1,001–2,500 and 2,501–5,000 use the 1,001–5,000 rates; 5,001–10,000 and 10,000+ use the 5,000+ rates.
- Any price you type by hand after selecting stays editable; changing volume again re-applies the tier prices to those three services.
- PDF shows the new volume labels automatically.

## Technical details
- `src/components/EnhancedROICalculator.tsx`: replace `westfieldRate` with `pickPackTier(orders)` returning `{ base, bundle }`; DTC cost = orders × base + orders × min(1, avgUnits−1) × bundle; FBA prep math unchanged; add `returnsPerMonth` input, cost += returns × $1; conditionally render teamSize input; update breakdown formulas and the payload sent to the report email (`send-roi-report`) and PDF generator.
- `src/components/admin/CreateQuoteDialog.tsx`: new `VOLUME_OPTIONS`, default `"0-500"`, shared tier map, effect on `orderVolume` change updating matching line item prices; `DEFAULT_PRICES` Single Product/Bundling seeded from the selected tier.
- Saved quotes with old "0-1000" value still display their stored label.
