# Fix Stats Overlap + Revert Testimonials to Sans

## Issue 1 — "By the numbers" stats are crushed/overlapping
The 7xl counters (`text-7xl` ≈ 72px) are too wide for narrow grid columns, so "2,000,000+" and "99.8%" visually collide on this viewport.

**Fix in `src/components/StatsStrip.tsx`:**
- Reduce counter scale: `text-5xl md:text-6xl lg:text-7xl` → `text-4xl md:text-5xl lg:text-6xl`
- Add `tabular-nums` (uniform digit width) and `break-words` for safety
- Keep all other styling identical

## Issue 2 — Testimonials use the new italic serif
Revert testimonial display type back to the original Inter sans, while keeping the rest of the homepage's Fraunces accents.

**Fix in `src/components/Reviews.tsx`:**
- Heading accent "say." — remove `font-display italic font-normal`, keep `text-secondary`
- Featured quote blockquote — replace `font-display italic text-3xl md:text-5xl lg:text-6xl` with `text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.25]` (Inter, slightly smaller for readability, normal weight)

## Files Modified
- `src/components/StatsStrip.tsx`
- `src/components/Reviews.tsx`

## Unchanged
- All other Fraunces usages across Hero, FAQ, Services, ValueProposition, etc.
- Layout, colors, copy, and section structure
