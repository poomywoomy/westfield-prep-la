# Add Monthly Order Volume to Quote Builder & PDF

## What you'll see

**Create Quote dialog (Step 01 Client section)**
- A new "Monthly order volume" dropdown added to the client info grid (after Phone).
- Options:
  - 0–1,000 orders/month (**default**, pre-selected on open)
  - 1,001–2,500 orders/month
  - 2,501–5,000 orders/month (fills the gap between your listed ranges)
  - 5,001–10,000 orders/month
  - 10,000+ orders/month
- Selection also appears in the right-side live summary card.

**Generated PDF**
- The selected volume is rendered neatly in the existing gray info block under the "TO" customer details, as a labeled line: `Monthly Order Volume: 1,001–2,500 orders`.
- Placed below email/phone, aligned with the existing layout — no other PDF sections change.

## Technical details

- `src/components/admin/CreateQuoteDialog.tsx`
  - New state `orderVolume` (default `"0-1000"`), reset to default in `resetForm`.
  - `VOLUME_OPTIONS` constant with value/label pairs; `<Select>` wired into the Step 01 grid.
  - Summary panel gains a "Monthly volume" row.
  - Passed through `handleGeneratePDF` as `orderVolume` (undefined if cleared).
- `src/lib/quotePdfGenerator.ts`
  - `QuotePDFData` gains optional `orderVolume?: string`.
  - Renders in the TO info block after phone with a bold label, same 9pt style; spacing adjusts only when present.

## Verification

- Open the Create Quote dialog: dropdown defaults to 0–1,000, appears in summary.
- Generate a PDF with each volume option and visually inspect the info block (spacing, no clipping) via `pdftoppm` render.
