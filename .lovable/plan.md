# Contact Form: Orders (not Units) + Reorder Fields + Email Sync

## 1. Rename "Units Sold per Month" → "Orders per Month"

**`src/components/ContactForm.tsx`**
- Label text: "Units Sold per Month" → "Orders per Month"
- Error message: "Units sold per month is required" → "Orders per month is required"
- Placeholder: "Select monthly units" → "Select monthly orders"

**`supabase/functions/send-contact-email/index.ts`**
- Email HTML labels: `Units Sold per Month:` → `Orders per Month:` and `Units Sold/Month:` → `Orders/Month:`
- Rename local `safeUnitsPerMonth` → `safeOrdersPerMonth` and formatter `formatUnitsPerMonth` → `formatOrdersPerMonth` (values map unchanged).
- Deploy the edge function.

*Keeping the field key `unitsPerMonth` and DB column `units_per_month` unchanged to avoid breaking historical leads and schema — only the user-visible label changes.*

## 2. Reorder Fields Left-to-Right

Current order (two rows of two):
- Row 1: Full Name | Email
- Row 2: Phone | Business Name

New order (single logical L→R sequence, still two rows of two):
- Row 1: **Full Name** | **Business Name**
- Row 2: **Email** | **Phone Number**

Edit the two `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">` blocks in `ContactForm.tsx` (lines ~296–325) to swap Email ↔ Business Name.

## 3. Sync Order in Admin Email Template

**`supabase/functions/send-contact-email/index.ts`** — reorder the contact-details rows in the HTML email so they read: Full Name, Business, Email, Phone, then Orders/Month, etc.

## Not Touching
- Field storage keys (`unitsPerMonth`, `units_per_month` in DB) — internal only.
- Zod schema field names.
- Any other form logic, validation rules, or downstream tables.

## Verify
- Preview `/contact` shows Full Name | Business, Email | Phone; select label reads "Orders per Month."
- Send a test contact — admin email shows "Orders per Month" and matching field order.