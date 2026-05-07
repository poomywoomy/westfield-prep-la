## Master Agreement: Keep Paragraphs Together + Expand Removal Fee Clause

### 1. Prevent paragraphs from splitting across pages
**File:** `src/lib/documentGenerator.ts` (renderBlock, ~lines 453–522)

Currently each wrapped line is rendered individually with `ensureSpace(5)`, so a long body paragraph or subsection can break mid-paragraph onto the next page (which is what the screenshots show: section title at bottom, content on next page).

Update the renderer so that:
- **Subsection headings** (`14.2 Post-Termination Removal Fee` etc.) are kept together with the first 2–3 lines of the following paragraph. Implementation: when a subsection is encountered, measure the next non-blank block's wrapped height and call `ensureSpace(subsectionHeight + min(nextParaHeight, ~3 lines))` before rendering.
- **Body paragraphs** are rendered as a unit: pre-wrap the full paragraph, compute its total height, and call `ensureSpace(totalHeight)` once. If the paragraph is taller than a full page, fall back to the current line-by-line behavior. This guarantees short/medium paragraphs never break across pages.
- **Main section headings** (`8. FEES AND PAYMENT`) reserve enough space for the heading + the first subsection heading + a few lines so a heading never sits alone at the bottom of a page.

No visual style change — only pagination behavior.

### 2. Expand Section 14.2 (Post-Termination Removal Fee)
**File:** `src/lib/documentGenerator.ts`, `getSection14()` (~lines 133–152)

Replace the current single paragraph in both refundable and non-refundable variants with the following clause (keeping the existing setup-fee refund sentence at the end of the refundable variant):

> **14.2 Post-Termination Removal Fee**
> Upon termination of this Agreement for any reason, Client's remaining inventory shall be removed from Westfield's facility on an ad-hoc basis at a flat rate of **One Hundred Twenty-Five U.S. Dollars ($125.00) per pallet**. Client is solely responsible for arranging and scheduling pickup of the removed inventory with a carrier of Client's choosing.
>
> If Client's products are not already stored on pallets at the time of removal, Westfield shall consolidate, palletize, and stage the products for transport, with the per-pallet removal fee applied to the **total number of pallets rounded up to the nearest whole pallet**.
>
> Client must coordinate pickup of the staged inventory within a reasonable timeframe mutually agreed upon by both Parties. If Client fails to arrange pickup within the agreed timeframe, Westfield reserves the right to assess **additional storage fees** at Westfield's then-current storage rates for each day the inventory remains at the facility, until pickup is completed.
>
> *(Refundable variant only:)* The Post-Termination Removal Fee and any accrued additional storage fees must be paid in full prior to release of the remaining inventory. Upon satisfaction of all outstanding balances, the full {words} U.S. Dollar (${formatted}) account setup fee shall be refunded and wired back to Client.

### 3. Reflect $125/pallet in Fee Appendix (if applicable)
**File:** `src/lib/documentGenerator.ts` — the Appendix section (~lines 615+)

If the appendix lists removal/termination fees, add or update a line: *"Post-Termination Removal: $125.00 per pallet (rounded up); additional storage fees may apply if pickup is delayed beyond mutually agreed timeframe."* If the appendix doesn't currently mention removal, append it to the existing fee list.

### Out of Scope
- No DB schema changes
- No changes to `DocumentGeneratorTab.tsx` (the $125 rate is fixed in the contract template, not user-editable — let me know if you want it editable)
- No changes to PDF visual styling, header, footer, or signatures
