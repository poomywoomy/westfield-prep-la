# Quote builder pricing/description update

Update the Create Quote dialog defaults for DTC fulfillment line items.

## Changes
1. Set default price for **Single Product** to **$2.50** in `DEFAULT_PRICES`.
2. Set default price for **Kitting** to **$3.00** in `DEFAULT_PRICES`.
3. Update the **Kitting** auto-note description to: "Per kit assembled, bundling all units including promotional inserts into a single sellable unit."

## Scope
- File: `src/components/admin/CreateQuoteDialog.tsx` only.
- No data model or saved-quote migration needed; existing quotes keep their stored values, and new quotes will use the updated defaults.
- PDF output will reflect the new defaults automatically because it renders the line items passed from the dialog.
