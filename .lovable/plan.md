## Goal

Inside Admin → Documents tab, expand the Master Agreement so it is more in-depth (adding the SLA, error handling, invoice dispute, liability framework, abandonment, removal, insurance, and fee-schedule clarifications you provided), make the contract visually more polished, and let you control the intro-period dollar amount, the intro-period **length in months** (2, 3, 4, etc.), and the **setup-fee dollar amount** — all without losing any existing clauses.

Because the database migration to add new columns was declined, the new editable values will be encoded into the existing `minimum_spend_tier` and (for setup fee) into a serialized form on the same column, so history regeneration still works without schema changes.

---

## 1. New / expanded contract sections (added to `buildAgreementContent`)

All existing 16 sections stay intact. The following content gets added / merged in:

- **Section 2 — Service Level Expectations (SLA)** *(new, inserted; existing "Quality Control" is renumbered or kept as its own section)*
  - 24-hour standard turnaround for receiving and shipping
  - Shipping cutoff: 2:00 PM
  - Receiving cutoff: 5:00 PM
- **Section: Handling of Operational Errors** — pays out at customer sale price + 200% damages when the error is Westfield's failure to follow written, confirmed instructions.
- **Section: Invoice Dispute & Inventory Release** — invoices pulled directly from WMS; in good-faith disputes, inventory is not withheld provided 50% of the invoice is paid while the dispute is resolved.
- **Section: Liability Framework** — operational errors covered under the error-handling clause; catastrophic coverage of $2,000,000/year/client and $1,000,000/incident; premium options if inventory approaches that threshold.
- **Section: Inventory Handling & Abandonment** — automated abandonment notifications; inventory securely held; no new orders fulfilled until resolved.
- **Section: Post-Termination Removal Fees** — ~$125/pallet to repalletize and prep for shipment; no quantity discounts; outbound shipping arranged by client.
- **Section: Insurance & Product Handling Standards** — pet food / regulated goods handled to spec, dry warehouse kept at 68°F year-round, zero pest history, monthly professional pest inspections, daily deep cleaning Mon–Fri.
- **Fee Schedule / Pilot Terms appendix** — clarifies that **palletized inbound shipments are charged the pallet receiving fee only, not pallet + carton receiving**.

These will be inserted in a sensible order and the existing numbering shifted so nothing is dropped. All current clauses (Services, Client Responsibilities, Regulated Goods, Fees & Payment, Storage & Abandonment, Risk of Loss, Insurance, Limitation of Liability, Assumption of Risk, Indemnification, Bailment, Dispute Resolution, Term & Termination, Miscellaneous, Execution) remain.

---

## 2. Editable intro-period length & setup-fee amount

### UI changes — `src/components/admin/DocumentGeneratorTab.tsx`

In the "Custom Tier" inputs (only shown when Minimum Spend = Custom):

- **Intro Period Amount ($)** — already exists.
- **Intro Period Length (months)** — *new*, numeric, defaults to 3, accepts any whole number ≥ 1 (so you can pick 2, 4, etc.).
- **Ongoing Amount ($)** — already exists.

In the Setup Fee section:

- Convert the Setup Fee select into:
  - **Refundable / Non-Refundable** (kept as today)
  - **Setup Fee Amount ($)** — *new*, numeric, defaults to 500, editable to any whole-dollar value.

### Encoding (no DB migration)

`minimum_spend_tier` string format extended:

```
custom:<intro>_then_<ongoing>_for_<months>      e.g. custom:500_then_1000_for_4
custom:<flat>                                    (unchanged)
custom:<intro>_then_<ongoing>                    (legacy, still parsed as 3 months)
```

Setup fee amount is appended onto the same column using a suffix that the parser strips, so existing rows keep working:

```
...|fee:750
```

`generated_documents` history rows store the same string. Regeneration parses it back into intro/ongoing/months/fee. `formatMinimumTierLabel` is updated to display the term and fee in the history table.

### Contract text consumes the new values

`getSection5_5(tier)` is rewritten to render the chosen intro length naturally, e.g.:

> "For the first **four (4) months** following the Effective Date, the minimum payment shall be **Five Hundred U.S. Dollars ($500)** per month. Following this initial four-month period, the minimum payment requirement shall increase to **One Thousand U.S. Dollars ($1,000)** per month."

`getSection5_1` and `getSection14` are updated to render the chosen setup-fee dollar amount (in both digits and words) instead of hard-coded "$500", preserving the refundable vs non-refundable wording.

---

## 3. Polished PDF visual design

`generateDocumentPDF` in `src/lib/documentGenerator.ts` is refreshed to look professional rather than amateur:

- **Cover header band** — thin Midnight Navy bar across the top with the centered Westfield logo, then a slim Orange accent rule beneath it.
- **Document title block** — title in larger, letter-spaced bold; under it a small "Effective Date" line and a horizontal hairline separator.
- **Typography hierarchy**
  - Main section headers: navy color, 12pt bold, all-caps, with a short orange underline rule.
  - Subsection headers: 10pt bold, dark gray.
  - Body: 9.5pt, justified-style line breaking, increased line-height for readability.
- **Consistent margins** widened slightly; running footer on every page with: page number, "Westfield Prep Center — Client Service Agreement", and the effective date.
- **Bullet points** rendered with a real bullet glyph and proper indent (current contract uses dashes).
- **Signature block** redesigned as two clean cards with labeled fields (Signature / Printed Name / Title / Date), aligned baselines, and a subtle border.
- **Appendix page** for the Fee Schedule / Pilot Terms with its own heading style.

Brand palette stays consistent with the existing Midnight Navy / Orange identity.

---

## Files to change

```text
src/components/admin/DocumentGeneratorTab.tsx
  - Add intro-months input
  - Add setup-fee-amount input
  - Update encode/decode + label formatter
  - Pass new fields through to ClientDetails

src/lib/documentGenerator.ts
  - Extend ClientDetails (introPeriodMonths, setupFeeAmount)
  - Add new contract sections (SLA, errors, dispute, liability,
    abandonment, removal, insurance, fee schedule appendix)
  - Rewrite getSection5_1 / getSection5_5 / getSection14 to use
    dynamic months + fee amount
  - Redesign PDF rendering (header band, typography, footer,
    signature cards, appendix page)
```

No database changes. No edits to Header / Footer / Logo. Existing history rows remain regenerable.
