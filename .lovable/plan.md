

## Plan: Add a Separate "One-Time Quotes" Tab for Project-Based Work

### Goal
Currently the "Create Quote (Prospect)" button on the Clients tab opens a long-term recurring service quote (with monthly minimums, storage, fulfillment sections, etc.). We'll add a **second, distinct tab and button** specifically for **one-time / project-based quotes** (e.g. a single inventory audit, a one-off pallet rework, a seasonal kitting project) so it doesn't get mixed in with prospects expecting an ongoing fulfillment relationship.

### What you'll see in the UI

1. **New sidebar entry** in Admin Dashboard: **"One-Time Quotes"** (icon: `FileText` or `Receipt`), placed just below `Clients`.
2. **New button on the Clients tab** alongside the existing two: `Create One-Time Quote` (distinct color/variant from the recurring one).
3. **New tab page** listing all one-time quotes separately from recurring/prospect quotes — same card layout, View / PDF / Delete actions, but clearly labeled "One-Time Project Quote".

### How the one-time quote differs from the recurring quote

| Feature | Recurring Quote (existing) | One-Time Quote (new) |
|---|---|---|
| Purpose | Long-term prospect, monthly billing | Single project, one invoice |
| Minimum spend tier | Required ($250/$500/$1,000/mo) | **Removed** |
| Storage / monthly fees section | Included | **Removed** |
| Fulfillment sections (Amazon/Shopify/B2B/etc.) | Multi-section | **Single flat line-item list** |
| Project description field | No | **Yes** (e.g. "Q4 inventory audit – 12 pallets") |
| Project timeline | No | **Yes** (estimated start/end date, optional) |
| Estimated total | Per-month | **Project total ($)** auto-summed |
| PDF header | "Service Quote" | **"Project Quote"** |
| Activates monthly billing cycle on assignment | Yes | **No** (creates a one-off bill instead, future enhancement — for now stored as quote only) |

### Files affected

- **New:** `src/components/admin/CreateOneTimeQuoteDialog.tsx` — simplified dialog (project name, description, line items, total, optional client assignment).
- **New:** `src/components/admin/OneTimeQuotesTab.tsx` — list view filtered to one-time quotes only.
- **New:** `src/lib/oneTimeQuotePdfGenerator.ts` — PDF template tuned for a single-project quote.
- **Edit:** `src/pages/AdminDashboard.tsx` — register new lazy-loaded tab + `<TabsContent value="one-time-quotes">`.
- **Edit:** `src/components/app-sidebar-admin.tsx` — add menu item with icon.
- **Edit:** `src/components/admin/ClientsTab.tsx` — add third button "Create One-Time Quote".
- **Edit:** `src/components/admin/QuotesTab.tsx` — filter list to exclude one-time quotes (keep only recurring).

### Database

The existing `quotes` table stores its config in a flexible `quote_data` jsonb column. We'll add a single discriminator field inside that JSON: `quote_data.quote_type: 'recurring' | 'one_time'` (defaults to `'recurring'` for all existing rows). **No migration needed** — JSON is schemaless and existing rows are treated as recurring. Filtering both tabs uses `quote_data->>'quote_type'`.

If you'd prefer a real column for cleaner querying, we can add `quote_type text default 'recurring'` to the `quotes` table — let me know.

### Out of scope (for this round)
- Auto-generating a one-off bill from a one-time quote on acceptance (can be a follow-up).
- Email send / e-signature on the project quote PDF.

<lov-actions>
<lov-suggestion message="Approved — implement the One-Time Quotes tab as planned, using the JSON discriminator (no DB migration).">Approve plan (JSON discriminator)</lov-suggestion>
<lov-suggestion message="Approved, but add a real quote_type column to the quotes table via migration instead of using a JSON field.">Approve with new DB column</lov-suggestion>
<lov-suggestion message="Also auto-generate a one-off bill (single invoice) when a one-time quote is assigned to a client, so it flows straight into billing.">Add: auto-create one-off bill on assignment</lov-suggestion>
<lov-suggestion message="Add a duplicate/clone action so I can quickly create a similar one-time project quote from an existing one.">Add: clone one-time quote action</lov-suggestion>
</lov-actions>

