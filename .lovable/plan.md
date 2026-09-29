# Admin: Shipping Zone Map + Materials Pricing

Two new admin actions, built the same way as "Create Quote" / "Create One-Time Quote": a button in the Clients area opens a large two-pane dialog (form on the left, live summary on the right) with a "Download PDF" button.

## 1. Create Shipping Zone Map

**Header info**
- Client: pick an existing client, or type a prospect (company, contact, email, phone), same as the quote dialogs
- Origin fixed to ZIP 91010 (Duarte area is shown only as "Los Angeles, CA" on the PDF, per brand rules)
- Carrier label (default USPS Ground Advantage) and date

**Reference addresses (screen only, not on PDF)**
- A panel listing one real, public destination address for each USPS zone 1 to 8 from origin 91010 (for example a post office or city hall in each zone), with a "Copy" button on each so you can paste it into USPS/ShipStation to look up rates
- Zones are USPS's distance bands from 91010; the list is a fixed reference built into the app and marked "verify on USPS Zone Chart"

**Package sizes**
- Starts with one package row (L x W x H in inches, weight in lb, label like "Small box")
- "Add package" to add more sizes/weights; remove any row
- If there is only one package, the grid shows a single static size and weight

**Rate grid**
- Table: rows = packages, columns = Zone 1 to Zone 8
- You type the price for each cell; blanks show "—"
- Optional handling/markup note field and comments

**PDF**
- Navy header band with logo, "SHIPPING ZONE MAP" title, company info (Westfield Prep Center, Los Angeles, CA, info@westfieldprepcenter.com, 818-935-5478)
- From / To blocks with client details, origin "Los Angeles, CA 91010", date
- Simple visual zone legend (Zones 1 to 8 with typical mile ranges)
- Rate table with aligned columns, zebra rows, package dimensions and weight under each label
- Comments, disclaimer ("rates are estimates, subject to carrier changes"), page footer with page numbers
- No reference addresses on the PDF

## 2. Materials Pricing

**Header info**: same client/prospect block and date.

**Line items** (add as many as needed)
- Material dropdown: Carton, Poly Mailer, Thermal Mailer, Filling, Bubble Wrap, Cold Packs, Kraft Mailers, Custom
- Size field (optional) shown for Carton, Poly Mailer, Thermal Mailer, Cold Packs, Kraft Mailers, Custom; hidden for Filling and Bubble Wrap
- Custom lets you type the material name
- Unit price, unit (each / per ft / per lb), optional quantity, optional notes
- Live summary shows each line and a total when quantities are entered

**PDF**
- Same modern layout: navy header, company + client blocks, date
- Table: Material, Size, Unit, Unit Price, Qty, Total, with notes wrapped neatly under each item
- Total bar (only when quantities exist), comments, disclaimer, footer

## Saving
Both are saved so you can reopen, edit, re-download or delete them, each with its own list tab in the admin portal (like One-Time Quotes). They reuse the existing quotes storage, tagged as "shipping_zone_map" or "materials_pricing", so no database changes are needed and existing quote lists filter them out.

## PDF quality check
After building, generate sample PDFs with 1 and several packages / 8+ materials, turn them into images and check for overlap, clipping, alignment and page breaks, then fix any issues.

## Technical details
- New: `CreateShippingZoneMapDialog.tsx`, `CreateMaterialsPricingDialog.tsx`, `ShippingZoneMapsTab.tsx`, `MaterialsPricingTab.tsx` in `src/components/admin/`
- New PDF generators: `src/lib/shippingZoneMapPdfGenerator.ts`, `src/lib/materialsPricingPdfGenerator.ts` (jsPDF, same helpers/colors as `oneTimeQuotePdfGenerator.ts`, with page-break checks and wrapped text)
- Zone reference data: `src/data/uspsZoneReference.ts` (zone, miles range, sample address)
- Data stored in `quotes.quote_data` with `quote_type`; update `QuotesTab` / `OneTimeQuotesTab` filters to exclude the new types
- Add buttons to `ClientsTab.tsx` and new tabs/sidebar entries in `AdminDashboard.tsx` / `app-sidebar-admin.tsx`
