# Create Quote — cleanup pass

Seven fixes to the Create Quote builder and the generated PDF. No pricing logic or data model changes.

## 1. Reorder client fields
Swap the first two inputs so the order reads: Contact name, Company name, Email, Phone.

## 2. Storage descriptions printing twice
Storage rows currently get "Per pallet, per month" from two places: the auto-note attached to the line item, and a second hardcoded billing note the PDF adds on its own. Fix: the PDF stops adding its own storage billing note and prints only the line item's note, so each row shows the description once. Editing the note in the builder now fully controls what prints.

## 3. Returns Handling rename
Rename the service to "Returns and Removal Order Handling" everywhere it appears (default standard line items, dropdown options, default price $1.00, and its description).

## 4. Larger modal
Widen the dialog to a wider max width and increase the working height so more rows are visible without scrolling.

## 5. Conditional-charge wording
Append to the Bubble Wrap / Bubble Wrapping / Bundling descriptions: charge is only applied if applicable to the product.

## 6. Prefilled channel line items
Selecting Amazon FBA, Walmart WFS, or TikTok Shop now auto-populates that channel's standard services (with default descriptions and prices) the same way Standard Operations does, instead of opening empty. Rows stay fully editable and removable. Self Fulfillment and B2B are unchanged unless you want them prefilled too.

## 7. PDF layout cleanup
Same structure and sections, tightened typography:
- Consistent vertical rhythm between rows, sections, and headers so text never crowds the line above.
- Service name and price on one baseline; long service names wrap instead of colliding with the price column.
- Notes indented in a narrower, fixed measure with correct line-height so wrapped lines stay readable.
- Header block, TO/FROM panel, and footer given proper padding; page-break thresholds recalculated so sections don't split awkwardly or overrun the footer rule.

## Technical notes
- `src/components/admin/CreateQuoteDialog.tsx`: field order, `DialogContent` sizing, `STANDARD_SERVICES` / `AUTO_NOTES` / `DEFAULT_PRICES` label and copy edits, and a channel-defaults map used by `addFulfillmentSection`.
- `src/lib/quotePdfGenerator.ts`: drop the `STORAGE_BILLING_NOTES` duplicate render, rework `drawServiceItem` / `drawSectionHeader` spacing and wrap widths, adjust `checkPageBreak` thresholds.
