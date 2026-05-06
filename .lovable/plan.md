## Goal

Expand the Master Agreement contract with new operational sections, make the intro period length and setup fee dollar amount editable, and visually polish the PDF.

## 1. Contract content additions (`src/lib/documentGenerator.ts`)

Insert these as new numbered sections, renumbering the existing sections so nothing is lost (current 6→7→8 etc. shift down accordingly). Final structure:

1. SERVICES (unchanged)
2. **SERVICE LEVEL EXPECTATIONS (SLA)** — NEW
   - 24-hour standard turnaround for receiving and shipping
   - Shipping cutoff: 2:00 PM PT
   - Receiving cutoff: 5:00 PM PT
3. **HANDLING OF OPERATIONAL ERRORS** — NEW
   - For labeling/bundling errors caused by Westfield failing to follow written, confirmed instructions: client reimbursed at the customer sale price (not COGS) plus 200% damages
4. QUALITY CONTROL (current §2)
5. CLIENT RESPONSIBILITIES AND REPRESENTATIONS (current §3)
6. REGULATED AND HIGH-RISK GOODS (current §4)
7. FEES AND PAYMENT (current §5) — add a new subsection:
   - **Fee Schedule / Pilot Terms clarification**: palletized inbound shipments are billed the **pallet receiving fee only**, not pallet + carton receiving combined
8. **INVOICE DISPUTE & INVENTORY RELEASE** — NEW
   - Invoices pulled directly from WMS
   - Good-faith disputes do not trigger inventory hold; client pays 50% of disputed invoice while dispute is worked
9. STORAGE AND ABANDONMENT (current §6) — extend with:
   - Automated abandonment notification emails
   - During abandonment, inventory is securely held but no new orders fulfilled until resolved
10. RISK OF LOSS AND CARRIERS (current §7)
11. **LIABILITY FRAMEWORK / INSURANCE** — replaces current §8
    - Operational errors covered per Section 3
    - $2,000,000 aggregate per client per year, $1,000,000 per incident
    - Premium insurance discussion triggered when inventory value approaches/exceeds $1,000,000
12. LIMITATION OF LIABILITY (current §9)
13. ASSUMPTION OF RISK AND RELEASE (current §10)
14. INDEMNIFICATION (current §11)
15. BAILMENT LIMITATION (current §12)
16. DISPUTE RESOLUTION (current §13)
17. TERM AND TERMINATION (current §14) — update §17.2 (Post-Termination Removal Fee):
    - Standard rate ~$125/pallet to repalletize and prep for outbound
    - No quantity discounts; outbound shipping arranged by client
    - Must be paid before inventory release
18. **PRODUCT HANDLING STANDARDS** — NEW
    - Dry warehouse, maintained at 68°F year-round
    - Zero pest issues; monthly professional pest inspection
    - Daily deep cleaning Mon–Fri after closing
    - Pet food and regulated goods handled per these standards (still client's regulatory responsibility)
19. MISCELLANEOUS (current §15)
20. EXECUTION (current §16)

All new section numbers will be reflected in `getSection5_5`, `getSection14`, etc. (rename helpers if needed: `getSection7_5`, `getSection17`).

## 2. Editable intro period length & setup fee

**`ClientDetails` interface adds:**
- `introPeriodMonths?: number` (default 3)
- `setupFeeAmount?: number` (default 500)

**`DocumentGeneratorTab.tsx`:**
- Add **Intro Period (months)** number input that appears whenever the minimum tier has an intro period (the existing `250_then_500` and `custom` with intro). Default 3, min 1, max 24.
- Convert the Setup Fee selector from "$500 Refundable / $500 Non-Refundable" into:
  - Setup Fee Amount ($) — number input, default 500
  - Refundable toggle (Yes/No)
- Persist both new fields in `generated_documents` (new columns `intro_period_months int`, `setup_fee_amount numeric`); regenerate path reads them back.

**`documentGenerator.ts`:**
- `getSection5_1` uses dynamic `setupFeeAmount` (number-to-words + formatted dollars) and refundable flag.
- `getSection5_5` uses dynamic `introPeriodMonths` to replace the hardcoded "three (3) months" wording (e.g., "two (2) months", "four (4) months").
- `getSection14` (Post-Termination Removal Fee) refers to the same dynamic setup-fee amount when refundable.

**Migration:** add `intro_period_months` and `setup_fee_amount` columns to `generated_documents`.

## 3. PDF visual polish

Make the document look professionally produced rather than a plain text dump:

- **Cover header band**: thin Midnight Navy (#0A0A23) bar across the top of page 1 with the Westfield logo (white version or on white background) on the left and "CLIENT SERVICE AGREEMENT" wordmark on the right
- **Title block**: larger serif-style title with a subtle Orange (#FF7A00) underline accent and an "Effective Date" / "Prepared for: {Company Name}" two-line block beneath
- **Section headers**: numbered sections rendered with a small navy left-bar accent and tighter heading typography (12pt bold + small subtitle bar instead of plain bold caps)
- **Subsection headers**: 10pt bold, slightly indented, with a thin orange tick mark
- **Body type**: switch from raw 9pt Helvetica to 10pt with 1.35 line-height for readability; consistent paragraph spacing
- **Page footer on every page**: thin divider line + left "Westfield Prep Center · Los Angeles, CA" + right "Page X of Y" in 8pt muted gray
- **Signature block**: framed two-column box with light gray border, labels in small caps, longer signature lines, and a "Date" field aligned consistently
- **Page break safety**: never split a section header from its first paragraph

No external font dependencies; use jsPDF built-ins (helvetica + times) plus drawn rectangles/lines for the accent treatment.

## Files touched

- `src/lib/documentGenerator.ts` — content rewrite + visual polish + dynamic intro/setup fee
- `src/components/admin/DocumentGeneratorTab.tsx` — new inputs, validation, persistence, regenerate
- New Supabase migration adding `intro_period_months` and `setup_fee_amount` to `generated_documents`

No changes to other contract behavior, schema relationships, or unrelated UI.