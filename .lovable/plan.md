
## Goal

Three Launchpad modals (and a few cards) currently show empty grey "IMG" boxes or blank icon-in-a-rectangle tiles where photos would go. You want those slots redesigned as **fully composed graphic + information panels** that stand on their own — no photography, no uploads, nothing for you to fill in later.

## What changes

### Modals to rebuild (`src/components/launchpad/ServiceDetailModal.tsx`)

**1. `GalleryModal` (A+ Content / plum)**
Replace the 4 deliverable tiles (currently `<aspect-16/9>` empty plum gradient + `FileText` icon) with **A+ module wireframes drawn in SVG**:
- Module 01 "Hero Module" → SVG wireframe of a hero band: big bar of color, two text bars, a CTA pill.
- Module 02 "Comparison Chart" → SVG wireframe of a 4-column comparison grid with check/dot rows.
- Module 03 "Lifestyle Band" → SVG wireframe of a 3-up image-band with caption rules.
- Module 04 "Storefront Pages" → SVG wireframe of multi-page storefront nav + tile grid.
Each tile keeps the `MODULE 0X` label, italic serif title, description, and adds a tiny dimensions tag (e.g. `970 × 600 · DESKTOP`) and a 1-line "what it does" stat (e.g. `+18% conversion lift on PDPs`).

**2. `MagazineModal` (Storefront / cream + black)**
Replace the 3 "IMG" squares in the "Inside this issue" grid with **typographic + diagram tiles**:
- Design System → mini color-swatch row + type scale (`H1 / H2 / Body`) + 4-pt grid dots.
- Page Layouts → ASCII-style wireframe of Hero / PDP / Collection stacked.
- Responsive Build → 3 device frames drawn as nested rectangles labeled `XS / MD / XL` with breakpoint numbers.
Keep the editorial border and bottom title; just swap the empty `IMG` square for the composed graphic.

**3. `ContactSheetModal` (Studio Photography / terracotta)**
Replace the 5 empty "film frames" (currently dark squares with a `Camera` icon) with **a contact-sheet info strip**:
- Each frame becomes a labeled production card: frame number, deliverable name, a small SVG glyph appropriate to it (lightbox / mannequin silhouette / flat-lay grid / model pose silhouette / color chip), shot count (`24 frames`), aspect (`1:1 · 4:5`), and a hand-drawn sprocket-hole strip top + bottom so it still reads as film.
Add a "Production days" mini Gantt bar (Pre-Pro / Shoot / Delivery) under the strip using thin colored bars instead of just text.

### Cards to clean up (`src/components/launchpad/ServiceCards.tsx`)
Audit the 7 card variants for any remaining empty image rectangles. Where they exist (likely Storefront, A+, Photo cards), swap them for the same family of composed graphics — wireframes, type specimens, swatch rows, gantt bars, sprocket strips — sized to the card.

### What I will NOT touch
- Card grid logic, modal routing, theme tokens, contact form, FAQ, picker, copy in `launchpadServices.ts`.
- No new dependencies, no image generation, no DB.
- All graphics are inline SVG / divs styled with each service's existing theme colors.

## Technical notes

- All wireframes are inline `<svg>` with `currentColor` or theme hex values already defined per modal — no asset imports.
- Reusable mini components defined locally inside `ServiceDetailModal.tsx` (e.g. `<HeroWire />`, `<ComparisonWire />`, `<DeviceStack />`, `<SprocketStrip />`).
- Tiles keep their existing aspect ratios so layout/spacing doesn't shift.
- Responsive: graphics scale with `viewBox` so they hold up at all modal widths.
- Accessibility: each SVG gets `role="img"` + `aria-label` matching the deliverable title.

## Files touched

- `src/components/launchpad/ServiceDetailModal.tsx` — rebuild Gallery, Magazine, Contact Sheet tile contents.
- `src/components/launchpad/ServiceCards.tsx` — replace any leftover empty image slots with composed graphics.
