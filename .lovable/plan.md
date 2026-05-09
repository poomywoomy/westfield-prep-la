## Goal
Expand `/launchpad` into a richer, longer page with dedicated, uniquely styled sections per service, add a "what you actually need" bullet checklist, and wire "View Pricing" to open the contact form with **Launchpad** preselected.

## 1. New service deep-dive sections (one per service, each visually distinct)

Add a stack of full-bleed alternating sections, each with its own color theme, accent graphics, and layout. Six sections total:

1. **Shopify Website Creation** — emerald/mint palette, browser-frame mockup graphic, split layout (copy left, mock storefront right).
2. **Amazon Seller Central Setup** — deep indigo + Amazon orange accent, checklist card layout, "Brand Registry / Category Approvals / Listing infrastructure" pillars.
3. **A+ Content & Storefront Design** — warm cream + plum accent, magazine-style 3-column module preview (comparison chart, hero module, lifestyle band).
4. **Storefront Design (Shopify theme + Amazon Storefront)** — charcoal + electric coral, large device-mockup composition (desktop + mobile).
5. **Product Imaging (3D renders)** — midnight navy + cyan accent, isometric "infinite angles" rotating-cube graphic, bullet feature list.
6. **Studio Photography & Model Shoots** — sandstone + terracotta, contact-sheet/film-strip motif, LA studio mention.

Each section uses the same primitives (eyebrow label, large heading with italic accent word, paragraph, 4-bullet feature list, CTA "Start this service →" linking to `/contact?service=launchpad&focus=<slug>`). Distinct background colors and one unique decorative SVG/graphic per section so they each feel bespoke without breaking the page rhythm.

Replace the current generic "What we help with" 6-card grid with a compact anchor-nav strip at the top of these sections (jump links to each service).

## 2. "What you actually need" bullet checklist

New section near the top (just below hero, above the deep-dives) titled **"Not sure what you need? Start here."** A two-column layout:

- Left: short intro copy.
- Right: bulleted checklist (checkbox-style icons, non-interactive) covering common launch needs:
  - A live Shopify store with payments, shipping, and apps configured
  - An Amazon Seller Central account with Brand Registry
  - A+ Content modules and an Amazon Storefront
  - Studio or 3D product imagery sized for every channel
  - Listing copy, titles, bullets, and backend keywords
  - A fulfillment partner ready to ship from day one

Each bullet links (anchor) to the matching deep-dive section below.

## 3. CTA wiring — "View Pricing" → Launchpad-preselected quote

- Change the hero **View Pricing** button (and any other "pricing"/"get pricing" CTAs added in the new sections) from `navigate("/pricing")` to `navigate("/contact?service=launchpad")`.
- Update `src/components/ContactForm.tsx` to read the `service` query param on mount via `useSearchParams` and, if it equals `launchpad` (or `3pl` / `both`), seed `formData.serviceType` accordingly. Also smooth-scroll the form into view.
- Per-section "Start this service" CTAs use `/contact?service=launchpad&focus=<service-slug>`; the focus param is appended into the comments textarea as a starter line ("Interested in: Shopify Website Creation").

## 4. Cleanup / consistency

- Keep Header, Footer, and existing hero untouched (per project rule).
- Keep the existing "3D vs Studio", "How it works", "Why Launchpad", and FAQ sections; reorder so deep-dives come after the new checklist and before "How it works".
- Maintain the existing cream/charcoal/terracotta base palette as the page chrome — section themes are accents within full-width bands, so the page still reads as one cohesive experience.
- Single H1 preserved (hero). All new section headings are H2.

## Files touched
- `src/pages/Launchpad.tsx` — major additions (checklist section + 6 deep-dive sections + anchor nav + CTA rewires).
- `src/components/ContactForm.tsx` — read `?service=` and `?focus=` query params to preselect serviceType and prefill comments.

No DB, no new dependencies.