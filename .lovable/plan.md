## Goal

Make Launchpad visually cohesive (one design language, no per-section color theming) and move each service's depth into a dedicated **modal**. Add **service checkboxes** to the Get a Quote screen so we capture exactly which Launchpad services the lead wants.

---

## 1. Launchpad page redesign

**Unified visual language** (drops the rainbow per-section themes from the current build):
- Single palette: existing brand Midnight Navy / Orange on a clean light surface, consistent typography across all sections.
- Same card treatment for every service — no emerald section, no indigo section, no terracotta section.

**New structure:**
1. Hero (kept, lightly polished — single H1).
2. "What we build" anchor strip → smooth-scrolls to the service grid.
3. **Service grid** — uniform 3-column card grid (responsive to 2/1) with the 7 services:
   - Shopify Website Creation
   - Amazon Seller Central Setup
   - A+ Content
   - Storefront Design
   - Product Imaging (3D / renders)
   - Studio Photography
   - Listing Copy & SEO
   
   Each card: small icon, service name, one-line summary, "View details" button. Cards are visually identical — only the icon differs.
4. **"Not sure what you need?" checklist** — kept, still anchors to cards but bullets now open the modal instead of scrolling.
5. FAQ + footer (kept).

**Service Detail Modal** (new — one component, data-driven):
Opens when any card or checklist item is clicked. Same layout for every service:
- Eyebrow (`SERVICE 0X`) + service name
- Hero summary paragraph
- "What's included" — 4–6 checkmark bullets
- "Deliverables" — small grid of 3–4 sub-modules (e.g. for A+: Hero Module / Comparison Chart / Lifestyle Band)
- "How it works" — 3-step timeline
- Primary CTA: **Get Pricing** → `/contact?service=launchpad&focus=<slug>` (closes modal, navigates)
- Secondary: Close

Built on the existing shadcn `Dialog`. All 7 services share this one modal; content comes from a `LAUNCHPAD_SERVICES` array.

---

## 2. Get a Quote screen — Launchpad service checkboxes

In `src/components/ContactForm.tsx`:
- When `serviceType` is `launchpad` (or `both`), render a new **"Which Launchpad services do you need?"** block with 7 checkboxes (one per service).
- Pre-check the box matching the `?focus=` query param when arriving from a card/modal CTA.
- Selected services are:
  - Shown as chips above the comments field
  - Submitted with the form (added to `comments` payload as a structured "Requested services: …" line, and stored on the lead row in a new `launchpad_services` text array column — or, to keep this purely frontend, prepended into `comments` only). **Default: prepend into `comments`** so no DB change is needed unless you want it stored separately.
- Remove the auto-generated "Interested in: …" sentence — replaced by the checkbox state.

---

## 3. Files touched

- `src/pages/Launchpad.tsx` — strip per-section themed blocks, replace with uniform card grid + modal trigger. Keep Hero, Header, Footer, FAQ untouched per project rules.
- `src/components/launchpad/ServiceDetailModal.tsx` — **new**, single reusable modal.
- `src/components/launchpad/launchpadServices.ts` — **new**, data array (slug, name, icon, summary, includes[], deliverables[], steps[]).
- `src/components/ContactForm.tsx` — add Launchpad services checkbox group, wire `?focus=` to pre-check, include selections in submission.

No DB migration, no new dependencies.

---

## Question before I build

Do you want the selected Launchpad services **just added to the comments field** on submission, or **stored in a dedicated column** on the leads table so you can filter/report on them later? (Dedicated column is cleaner but needs a small migration.)