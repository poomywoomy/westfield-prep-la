## Contact Form Redesign — Service-Type Aware Quote Form

Update the contact form so prospects can request **3PL Services**, **Launchpad** (brand-build help), or **Both**, with fields adapting to what they actually need.

---

### 1. New service-type selector (top of form)

Add a prominent 3-button segmented control at the top, defaulting to **3PL Services**, styled with brand Midnight Navy / Orange:

- **3PL Services** (default)
- **Launchpad**
- **Both**

---

### 2. Conditional field structure

**Always shown (all three modes):**
- Full Name *
- Email *
- Phone *
- Business Name *
- Comments * (now **mandatory** in all modes, min 10 chars)

**Shown for "3PL Services" and "Both" only:**
- Units Sold per Month *
- SKU Count *
- Marketplaces * (Shopify, Amazon, Walmart, TikTok Shop, Other)
- **Receiving Method *** (new) — `Cartons`, `Pallets`, `Both`
- **Packaging Requirements *** (updated options):
  - `Unbranded packaging`
  - `Custom packaging`
  - `I will provide my own packaging`
- Timeline *

**Launchpad-only mode** hides all 3PL operational fields. Comments label changes to: *"Tell us what you need help with — Shopify dashboard setup, Amazon account, A+ content / storefront, media content, 3D product imaging, model photoshoot, or anything else to get your brand off the ground."*

**Both mode** keeps all 3PL fields; comments label updates to cover both 3PL and Launchpad needs in one shared field.

---

### 3. Validation changes (zod schema in `ContactForm.tsx`)

- Add `serviceType: z.enum(["3pl", "launchpad", "both"])`
- Add `receivingMethod: z.enum(["cartons", "pallets", "both"])` — required only when `serviceType !== "launchpad"`
- Update `packagingRequirements` enum to `["unbranded", "custom", "own"]` — required only when `serviceType !== "launchpad"`
- `comments` now required: `z.string().trim().min(10).max(1000)`
- 3PL fields (`unitsPerMonth`, `skuCount`, `marketplaces`, `timeline`) become conditional via `superRefine` based on `serviceType`

---

### 4. Edge function update (`supabase/functions/send-contact-email/index.ts`)

- Update zod schema to mirror frontend (conditional fields, new fields, new packaging values)
- Update both the **admin notification email** and **client confirmation email** to:
  - Show "Service Requested: 3PL Services / Launchpad / Both" prominently at top
  - Show new `Receiving Method` row
  - Use new packaging labels (Unbranded / Custom / Customer-Provided)
  - Hide 3PL-specific rows when Launchpad-only
- Add `formatPackaging()` and `formatReceivingMethod()` label mappers

---

### Technical details

- File: `src/components/ContactForm.tsx` — refactor to conditional rendering driven by `serviceType` state; segmented control at top using brand colors
- File: `supabase/functions/send-contact-email/index.ts` — schema + email HTML template updates
- Honeypot, rate limiting, analytics tracking all preserved (analytics event extended with `service_type`)
- No DB schema changes required
- Heading copy updated: *"Tell us what you need — 3PL fulfillment, Launchpad brand services, or both."*