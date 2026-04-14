

## Plan: Redesign Quote PDF and Add Minimum Spend Dropdown

### Summary
Redesign the quote PDF to look more polished and professional, and add a minimum monthly spend dropdown selector to the quote creation form that renders a dedicated section in the PDF.

### Changes

**1. `src/components/admin/CreateQuoteDialog.tsx`**

**UI: Add Minimum Monthly Spend dropdown** (below the contact fields, above Standard Operations):
- New state: `minimumSpendTier` with options:
  - `"250_then_500"` -- "$250/mo for 3 months, then $500/mo"
  - `"500"` -- "$500/mo"
  - `"1000"` -- "$1,000/mo"
  - `""` (none selected)
- Render a Select dropdown with these three options
- Include in `resetForm()`

**PDF redesign** (the `generatePDF` function):
- Add a navy blue header banner (full-width colored rect behind "SERVICE QUOTE")
- Add thin accent lines between sections using the brand navy color (13, 33, 66)
- Use a subtle gray background box for the business/customer info area
- Add table-style headers for service line items (Service | Price columns with background)
- Add a "Minimum Monthly Spend" section after all services but before Additional Comments, rendered as a bordered callout box with the selected tier text
- Improve footer with centered company info and a thin top border
- Better spacing and typography hierarchy throughout

**Save minimum spend tier in quote data:**
- Include `minimum_spend_tier` in the `quote_data` JSON saved to the database

**2. `src/components/admin/QuotesTab.tsx`**

**Update `generatePDFFromQuote`** to match the same redesigned PDF layout, reading `minimum_spend_tier` from `quoteData`.

### Minimum Spend Text in PDF
The section will read:

- **$250 then $500**: "Client agrees to a minimum monthly service spend of $250.00 per month for the first three (3) months, increasing to $500.00 per month thereafter. Shipping costs, carton usage fees, and polybag usage fees are excluded from this calculation."
- **$500**: "Client agrees to a minimum monthly service spend of $500.00 per month. Shipping costs, carton usage fees, and polybag usage fees are excluded from this calculation."
- **$1,000**: "Client agrees to a minimum monthly service spend of $1,000.00 per month. Shipping costs, carton usage fees, and polybag usage fees are excluded from this calculation."

### What Stays
- All existing service types, fulfillment sections, team quote mode
- Quote save/delete/edit functionality
- Disclaimer text content (just styled better)

