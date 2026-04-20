

## Plan: Add Service Catalog Dropdown to One-Time Quote Line Items

### Goal
Make the One-Time Project Quote dialog use the same service catalog as the recurring quote dialog (so you don't have to type service names manually), but:
- **Exclude** services that don't make sense for a one-off project: `Account Startup Fee`, all storage tiers, and `Returns Handling`.
- **Auto-fill the description** with project-appropriate wording (rephrased so it reads as a one-time engagement, not a monthly recurring service).
- **Auto-suggest** a default unit price, but allow you to fully override it per line item to set a flat fee (the Qty × Unit Price total still renders, but you can also enter Qty = 1 with any flat price).

### What you'll see in the UI

In `CreateOneTimeQuoteDialog.tsx`, the line-items section changes:

1. The **Service / Description** text field becomes a **Select dropdown** of allowed services (plus `Custom Entry` for free-text).
2. Selecting a service auto-fills:
   - **Notes** field with the one-time project description for that service (see mapping below).
   - **Unit Price** with the default rate.
3. Both Notes and Unit Price remain **fully editable** after auto-fill, so you can override either.
4. Choosing `Custom Entry` clears the auto-fill and lets you type your own service name + notes + price.
5. The Project Total at the bottom continues to show `Σ(qty × unit_price)` and remains a dumb sum (no tier/minimum logic).

### Service catalog for one-time quotes

**Included** (drawn from the recurring catalog, with project-appropriate descriptions):

| Service | One-Time Description | Default Price |
|---|---|---|
| Pallet Receiving | One-time receipt and check-in of pallet(s) for this project | $50 |
| Carton Receiving | One-time receipt and check-in of carton(s) for this project | $3 |
| FNSKU Label | Per-unit FNSKU labeling applied during this project | $0.30 |
| Polybox+Label | Per-unit polybag + label applied during this project | $0.50 |
| Bubble Wrap | Per-unit bubble wrapping for this project | $0.40 |
| Bundling | Per-bundle assembly for this project | $0.75 |
| Additional Label | Per-unit additional labeling beyond standard for this project | $0.15 |
| Kitting | Per-kit assembly for this project | $1.00 |
| Palletizing | Per-pallet build & wrap for this project | $25 |
| Pick & Pack | Per-order pick & pack for this project | $2.50 |
| Single Product | Per-order single-item pick & pack for this project | $1.50 |
| Hourly Rate (VAS / Project Labor) | Per-hour project labor for value-added services | $45 |
| Materials (Boxes / Cartons / Polybags) | Project materials charged at Westfield pricing | $0 (you set) |
| Custom Entry | Free-text: define your own service for this project | $0 |

**Excluded** (per your spec): `Account Startup Fee`, `Pallet Storage`, `Small/Medium/Large Bin Storage`, `Shelf Storage`, `Returns Handling`.

### Override behavior
- Default price is suggested only when `unit_price === 0` at the moment of selection (matches recurring-quote behavior).
- You can change `unit_price` to any value at any time, including a single flat charge (e.g. set Qty = 1, Unit Price = $850 for a one-shot project fee).
- You can edit the auto-filled Notes to anything.

### Files affected

- **Edit:** `src/components/admin/CreateOneTimeQuoteDialog.tsx`
  - Add `ONE_TIME_SERVICES`, `ONE_TIME_NOTES`, `ONE_TIME_DEFAULT_PRICES` constants at the top.
  - Replace the free-text `service_name` Input with a `<Select>` dropdown.
  - When `service_name` changes and value !== "Custom Entry", auto-fill notes (if blank) and unit_price (if 0). When value === "Custom Entry", swap the dropdown for a text Input so you can type a custom service name.
  - Keep the existing override-friendly Notes textarea and Unit Price number input untouched.

### Out of scope
- No DB changes (still stored in `quotes.quote_data.line_items`).
- No changes to the PDF generator — it already renders `service_name`, `quantity`, `unit_price`, and `notes` exactly as captured.
- No changes to the recurring quote dialog.

