## Goal

Refresh `/why-choose-us` from a dark navy SaaS look into a **premium yet welcoming** page — Soft Linen & Sunset palette (cream backgrounds, peach mid-tones, warm orange accents, deep aubergine text) — with custom hand-crafted design elements throughout. Header, Footer, and Logo stay untouched (project rule).

## Color system (added to `src/index.css`)

New `--wcu-*` tokens override the existing dark-theme ones (no other page is affected because the tokens are page-scoped via the `wcu-*` names already in use):

```text
--wcu-linen        : 36 60% 96%   (#FAF5EF) — primary background
--wcu-cream        : 33 70% 92%   (warm panel)
--wcu-peach        : 22 100% 88%  (#FFD9C2) — soft accent fields
--wcu-sunset       : 18 100% 62%  (#FF7A3D) — primary accent / CTAs
--wcu-sunset-deep  : 14 80% 50%   — gradient end
--wcu-ink          : 260 21% 18%  (#2A2438) — primary text
--wcu-ink-soft     : 260 12% 38%  — secondary text
--wcu-line         : 28 35% 84%   — hairline borders
```

Existing dark `--wcu-bg-*` tokens are remapped to the new light palette so the entire page flips without touching every className. A few `text-white`, `text-gray-400`, `bg-black/30`, `border-white/10`, `bg-red-900/10`, `bg-green-900/10`, blue/purple/fuchsia accent classes inside the page get swapped for the new tokens (sunset, peach, ink, etc.). Body switches to `text-[hsl(var(--wcu-ink))]` and selection becomes sunset.

## Custom design layer (the "premium handcrafted" feel)

Three new in-file components plus organic dividers — all SVG, no new dependencies:

### 1. `<HeroBackdrop />` — replaces the navy hero
- Linen background with a hand-drawn topographic SVG pattern (concentric soft curves, very low opacity ink) anchored bottom-left.
- A large warm sunset gradient blob in the upper right (filtered with `feGaussianBlur`).
- Subtle paper-grain via SVG `<feTurbulence>` overlay at 4% opacity.
- A hand-drawn underline SVG swooshes under "Brand Deserves." in sunset orange.
- Pill badge: linen card with peach border and sunset icon.
- Primary CTA gradient `linen → sunset → sunset-deep` with soft inner shadow; secondary CTA is an outline button in ink.

### 2. `<OrganicDivider variant="wave|arch|notch" />`
- Reusable SVG section divider (curved, not straight) used between major sections so transitions feel soft and editorial instead of stacked rectangles.

### 3. `<JourneyPath />` — replaces the 3-pillar comparison's "deep dive" block on mobile/desktop with a custom 5-step hospitality-style timeline:
- Hand-drawn meandering SVG path connecting 5 milestone nodes (Welcome → Receive → Prep → Ship → Care).
- Each node is an oval cream card with a sunset-circle icon and short copy.
- Path is dashed in peach with sunset milestone dots; on desktop it curves; on mobile it becomes a vertical ribbon.
- This is the centerpiece "storytelling" graphic the user asked for.

### 4. Refreshed existing custom graphics
- **`ComparisonGraphic`**: red/green panels become "Old Way" (warm taupe with peach X icons) vs "Westfield Way" (cream with sunset checkmarks). Cards get a stitched dashed border on the Westfield side.
- **`TechStackGraphic`**: dark grid → cream grid, central hub becomes a sunset circle with a soft glow, connecting lines become hand-drawn dashed peach strokes, and node cards get rounded-3xl + ink hover ring.
- **`Dashboard mockup`**: window chrome stays but inverted — cream panel, ink text, sunset progress bar, peach surface stats. The traffic-light dots become muted dusty colors.
- **`LA Map graphic`**: black radial → linen with topographic rings, MapPin in sunset, city label in ink.
- **FBA stat cards**: peach/cream tinted backgrounds, brand icons in sunset/ink, big numbers in ink with sunset accent on one of them. Adds a small custom "ribbon" SVG behind one stat to feel handcrafted.
- **Launchpad teaser card**: cream card with peach inner panels, sunset icon chips, soft drop shadow (no harsh black).
- **FAQ accordion**: rows on cream, sunset chevrons, hover row turns to peach-50, divider becomes the dotted line motif.

## Section-by-section pass

1. **Hero** — new `HeroBackdrop`, hand-drawn underline, dual CTAs, social-proof bar with the existing `Si*` brand icons (no change there) recolored ink.
2. **Problem comparison** — refreshed warm cards as above; section background = peach gradient → linen.
3. **Built for High-Growth Brands deep dives** — three blocks reskinned. The colored category pills (blue/purple/orange) become a single muted ink-on-cream pill style with a small sunset square accent so the page feels cohesive instead of rainbow.
4. **NEW: Our Journey With You** — `<JourneyPath />` inserted between deep dive 2 and deep dive 3 as the storytelling centerpiece.
5. **FBA Mastery** — linen background, refreshed feature cards + stat tiles, custom ribbon SVG behind the "2M+" stat.
6. **Launchpad teaser** — cream-on-linen card, sunset accents only, soft shadows; gradient blobs swapped from blue/orange to peach/sunset.
7. **FAQ** — light accordion as described.
8. **Final CTA** — full-width sunset gradient band with cream text and a linen button; bottom and top get organic SVG dividers.

## Files touched

- `src/pages/WhyChooseUs.tsx` — color + class swap, new `HeroBackdrop`, `OrganicDivider`, `JourneyPath` components, refresh of in-file graphics. All edits stay in this one page file.
- `src/index.css` — append/override the `--wcu-*` token block under `:root` and add a small `.wcu-paper-grain` utility for the SVG noise overlay.

## Out of scope (unchanged)

- Header, Footer, global Logo.
- Other pages and global theme tokens.
- SEO/Helmet/StructuredData blocks (kept as-is).
- The H1 stays the single H1 (unchanged).

## Result

A warm, editorial "boutique hospitality meets premium logistics" page: cream paper feel, sunset accents, hand-drawn dividers and a custom journey graphic — visibly more bespoke than the current navy template, while keeping all copy, structure, and SEO intact.
