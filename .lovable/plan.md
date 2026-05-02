## Goal

Move the homepage off the warm "Soft Linen & Sunset" treatment and back to the official **Midnight Navy (#0A0A23) + Fulfillment Orange (#FF7A00) + Graphite + light gray** professional brand palette, restore the original warehouse hero photo, and swap the playful sketch-style SVGs for clean, premium infographics. Keep the Why Choose Us page untouched (it stays warm).

## Scope

- All homepage section components only.
- No copy, layout order, SEO, blog data, Header, Footer, or Logo changes.
- WhyChooseUs page and `--wcu-*` tokens remain as-is so that page is unaffected.

## Color & Style System

Use existing brand tokens already defined in `src/index.css`:
- `--primary` (Midnight Navy) for headings, dark sections, primary CTAs
- `--secondary` (Fulfillment Orange) for accents, highlights, secondary CTAs
- `--muted` / `--secondary-bg` (#F5F5F7) for soft section backgrounds
- `--background` (white) for clean cards
- `--graphite-gray` for body text
- `--border` for subtle dividers

Remove from homepage:
- `wcu-paper-grain` textures
- `SunsetBlobs`, `TopoBackdrop`, `SunburstStamp`, `HandUnderline`, `OrganicDivider` usage
- Dashed "stitched" outlines, peach/cream backgrounds, hand-drawn sketch SVGs

Replace with a small set of professional primitives (new file `src/components/home/HomePrimitives.tsx`):
- `SectionHeading` — eyebrow chip (orange on navy/10), navy H2, optional orange accent word with a clean 3px solid orange underline bar (no wobble)
- `GradientDivider` — thin horizontal navy→orange gradient line for section transitions
- `StatCard`, `FeatureCard`, `IconBadge` — white cards with subtle border, soft shadow, navy text, orange icons in a tinted square
- `GridBackdrop` — very subtle dotted/grid SVG pattern at 4% opacity for hero/CTA backgrounds (replaces topo + blobs)

## Hero Restoration

In `src/components/PremiumHero.tsx`:
- Remove `WarehouseSkyline` SVG, sun, mountains, blobs, topo, sunburst, hand underline.
- Restore the original loading-dock photo: import `@/assets/hero-warehouse-optimized.webp` (already used in the legacy `Hero.tsx`) as a full-bleed background with a navy gradient overlay (`from-primary/90 via-primary/80 to-primary/70`) for legibility.
- Headline: white, with the accent word in `text-secondary` (orange).
- Primary CTA: orange (`bg-secondary`); Secondary CTA: outline white.
- Trust/feature chips: translucent white cards with orange icons.
- Replace sunset peach feature ribbon with a clean horizontal trust bar on a darker navy strip below the photo.

## Section-by-Section Repaint

Touch only color/background/decoration — keep all content, headings, lists, and component structure. Files:

- `StatsStrip.tsx` — white background, navy stat numbers, orange underline accent, light gray dividers.
- `UseCaseSection.tsx` — `bg-muted` background, white cards, orange icon badges.
- `ValueProposition.tsx` — white background, navy headings, orange `IconBadge`s, remove peach panels.
- `Services.tsx` — alternating white / `bg-muted` rows, navy cards with orange icon squares.
- `HowItWorksProcess.tsx` — replace meandering dotted SVG path with a straight navy→orange gradient progress line and numbered orange circles.
- `PlatformCompatibility.tsx` — clean white logo grid on `bg-muted`, navy text.
- `Reviews.tsx` — white cards, navy quotes, orange stars, subtle border.
- `LocationShowcase.tsx` — replace stylized hand-drawn LA map with a clean monochrome navy SVG map (simple outline + orange location pin), `bg-muted` background.
- `LaunchpadCallout.tsx` — keep section, replace sunset rocket art with a sleek navy-to-orange gradient rocket icon on a navy panel with orange CTA. Copy unchanged.
- `BlogPreview.tsx` — restore standard white cards, navy titles, orange "Read more" links, light borders. Supabase fetch logic untouched.
- `FAQAccordion.tsx` — white accordion on `bg-muted` background, navy questions, orange chevrons.
- `FinalCTA.tsx` — full navy band, white headline, orange primary CTA, white outline secondary.
- `Compliance.tsx` — white background, navy badges with orange checkmarks.
- `StickyMobileCTA.tsx` — orange button on white pill with navy text.

## What Stays Unchanged

- `src/pages/Index.tsx` order, Suspense boundaries, Helmet/SEO, StructuredData
- All copy, headings, FAQ data
- `BlogPreview` data fetching
- `Header.tsx`, `Footer.tsx`, Logo
- `src/pages/WhyChooseUs.tsx` and all `--wcu-*` CSS tokens (kept for that page only)
- `WcuPrimitives.tsx` file remains (still used by Why Choose Us)

## Files

Created:
- `src/components/home/HomePrimitives.tsx`

Modified:
- `src/components/PremiumHero.tsx` (restore photo hero, drop wcu primitives)
- `src/components/StatsStrip.tsx`
- `src/components/UseCaseSection.tsx`
- `src/components/ValueProposition.tsx`
- `src/components/Services.tsx`
- `src/components/HowItWorksProcess.tsx`
- `src/components/PlatformCompatibility.tsx`
- `src/components/Reviews.tsx`
- `src/components/LocationShowcase.tsx`
- `src/components/LaunchpadCallout.tsx`
- `src/components/BlogPreview.tsx`
- `src/components/FAQAccordion.tsx`
- `src/components/FinalCTA.tsx`
- `src/components/Compliance.tsx`
- `src/components/StickyMobileCTA.tsx`

No CSS token additions required — homepage uses the existing brand tokens already in `src/index.css`.
