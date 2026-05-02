
## Goal
Stop the homepage from feeling like one long uniform page. Make the hero image actually visible, blow up the headline for CTR, and give each section its own visual identity (background, typography rhythm, card style, graphic treatment). Also fully rebuild the FAQ into something unique.

---

## 1. Hero Redesign (`src/components/PremiumHero.tsx`)

**Problems:** Image too dark (opacity 0.30 + 92% navy overlay = nearly black). Headline `text-4xl md:text-6xl lg:text-7xl` is centered in a wide column making it feel small at 2387px viewport. Layout is a tall centered stack — no focal hierarchy.

**New design — asymmetric split with cinematic image:**

```text
┌─────────────────────────────────────────────────────────────┐
│  [• LOS ANGELES 3PL]                                         │
│                                                              │
│  Ship 3x Faster.        │   ┌──────────────────────────┐    │
│  Shopify + Amazon       │   │                          │    │
│  Ready 3PL.             │   │   WAREHOUSE PHOTO        │    │
│  ───────────────        │   │   (bright, ~70% opacity, │    │
│                         │   │    soft navy gradient    │    │
│  Full-service           │   │    only on left edge for │    │
│  fulfillment & FBA      │   │    text legibility)      │    │
│  prep in 24 hours.      │   │                          │    │
│                         │   │   [floating stat card:   │    │
│  [Get Free Audit →]     │   │    99.8% accuracy]       │    │
│  [View Pricing]         │   │   [floating stat card:   │    │
│                         │   │    24hr turnaround]      │    │
│  ★★★★★ 4.9 · SOC2 ·     │   └──────────────────────────┘    │
│  500+ brands             │                                   │
└─────────────────────────────────────────────────────────────┘
```

**Specific changes:**
- Layout: `grid lg:grid-cols-12` → text col-span-7, image col-span-5 (image visually dominant on desktop, stacks on mobile with image on top).
- Headline size: `text-5xl md:text-7xl lg:text-8xl` left-aligned on desktop, with the orange accent on its own line and a 4px orange underline bar under "Ready 3PL".
- Image treatment: increase image opacity from `0.30` → `0.85`, replace full-screen navy wash with **left-side-only** linear gradient `linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.6) 35%, transparent 70%)` so the right half of the warehouse photo is fully visible.
- Add 2 floating glass stat cards over the image (absolute positioned, `bg-white/10 backdrop-blur-md border border-white/20`) — one top-right showing "99.8% Accuracy", one bottom-left showing "24hr Turnaround" with subtle entrance animation.
- Trust row: replace the 4 pill badges with a single inline row: `★★★★★ 4.9` · `SOC2 Ready` · `Trusted by 500+ brands`. Tighter and more authoritative.
- CTAs: keep both, but make primary CTA larger (`text-xl px-12 py-8`) with a glow ring `ring-4 ring-secondary/20` and add a tiny "No credit card · 24hr response" microcopy underneath.
- Remove the bottom 4-pill feature row (it duplicates the stat cards and trust badges) — consolidates the hero so the image/headline breathe.

---

## 2. FAQ Redesign (`src/components/FAQAccordion.tsx`)

**Replace the basic vertical accordion with a 2-column interactive layout:**

```text
┌──────────────────────────────┬──────────────────────────────┐
│  FAQ                         │                              │
│  Questions, answered.        │   ┌────────────────────────┐ │
│                              │   │  [active question      │ │
│  ▸ 01  Minimum orders?       │   │   highlighted in this  │ │
│  ▸ 02  Turnaround time?      │   │   answer panel — large │ │
│  ● 03  Platforms supported   │   │   readable text,       │ │
│  ▸ 04  How pricing works     │   │   optional bullet list]│ │
│  ▸ 05  Returns handling      │   │                        │ │
│  ▸ 06  Warehouse tours       │   │  [Talk to us →]        │ │
│  ▸ 07  How to start          │   └────────────────────────┘ │
│  ▸ 08  Why Westfield         │                              │
│                              │   Still curious?             │
│                              │   [Schedule a call]          │
└──────────────────────────────┴──────────────────────────────┘
```

- Left column = clickable question list with numbered prefixes (`01`–`08`); active item gets an orange left border + filled orange dot, inactive items show a chevron.
- Right column = sticky answer panel that updates on click (no expand/collapse jumping). Panel has a subtle gradient border, larger answer typography (`text-lg leading-relaxed`), and a contextual CTA button.
- Background: full-bleed off-white (`bg-[#F7F7F4]`) with a faint diagonal grid pattern, distinct from neighboring sections.
- Mobile: collapse back to single-column accordion (existing behavior preserved at `lg:` breakpoint).
- Add a small "Have another question?" card with phone number `1.818.935.5478` and a Schedule Call button in the bottom-right under the answer panel.

---

## 3. Section-by-Section Visual Differentiation

Currently every section uses the same white/muted bg + center-aligned `SectionHeading` + uniform card grid. Goal: each section feels distinct without losing brand cohesion.

| Section | Current treatment | New treatment |
|---|---|---|
| **StatsStrip** | Light bg, 4 even cards | **Dark navy band** with oversized animated counters (`text-6xl`), thin orange divider lines between stats, no card containers |
| **UseCaseSection** | White cards in grid | **Tabbed selector** (Shopify / Amazon / TikTok / DTC) with a single large feature card that swaps content; off-white bg with a floating product mockup illustration |
| **ValueProposition** | Center heading, 3 cards | **Left-aligned heading**, asymmetric card sizes (1 large hero card + 2 stacked smaller cards on right), serif accent font on numbers |
| **Services** | Grid of equal cards | **Bento grid** — one tall hero service card, four smaller cards in mosaic pattern; each card has a unique icon background color from a controlled palette |
| **HowItWorksProcess** | Linear progress markers | **Vertical timeline** on left with large step numbers (`text-7xl` outlined) and full-width content on right per step; navy-tinted background |
| **PlatformCompatibility** | Logo grid | **Horizontal marquee** of platform logos (auto-scrolling), with a center pause-on-hover state |
| **Reviews** | 3-card row | **Single large featured testimonial** with photo + star rating + outlet logo, plus a 3-thumbnail strip below to switch between reviews |
| **LocationShowcase** | Map card | **Full-width split** — map on left bleeding to edge, content on right with stacked stat tiles (port distance, FCs reachable, etc.) |
| **LaunchpadCallout** | Standard card | **Diagonal-stripe orange band** with offset white card containing the rocket graphic — visually breaks the page |
| **BlogPreview** | Equal cards | **1 featured large post + 2 smaller side posts** layout (magazine style) |
| **FinalCTA** | Already strong | Light polish — add the same floating glass stat cards from hero for visual callback |

**Cross-cutting rules:**
- Alternate section backgrounds: `bg-background` → `bg-[#F7F7F4]` → `bg-primary` (dark) → `bg-background` etc., so the page has rhythm instead of one continuous white field.
- Introduce a serif display font (`font-serif` via Tailwind, using e.g. Instrument Serif from Google Fonts) for **section eyebrow numbers and pull quotes only** — adds editorial contrast against the existing sans body. Headings stay sans.
- Standardize 3 distinct card styles in `HomePrimitives.tsx`: `cardSolid` (filled navy), `cardOutline` (white with thin border), `cardElevated` (white with shadow + orange top accent bar). Each section picks one — no section uses the same style twice in a row.

---

## Files to be modified / created

- **Modify**: `src/components/PremiumHero.tsx` — asymmetric layout, brighter image, larger H1, floating stat cards.
- **Modify**: `src/components/FAQAccordion.tsx` — 2-col split with sticky answer panel.
- **Modify**: `src/components/home/HomePrimitives.tsx` — add `cardSolid`, `cardOutline`, `cardElevated` variants and a `SectionShell` helper for alternating backgrounds.
- **Modify**: `src/components/StatsStrip.tsx`, `UseCaseSection.tsx`, `ValueProposition.tsx`, `Services.tsx`, `HowItWorksProcess.tsx`, `PlatformCompatibility.tsx`, `Reviews.tsx`, `LocationShowcase.tsx`, `LaunchpadCallout.tsx`, `BlogPreview.tsx`, `FinalCTA.tsx` — apply per-section treatments from the table above.
- **Modify**: `index.html` — add Google Fonts link for Instrument Serif (display use only).
- **Modify**: `tailwind.config.ts` — register `font-serif` family.

**Preserved (no changes):**
- All copy/text content
- Header, Footer, Logo
- BlogPreview Supabase data-fetching logic
- Why Choose Us page (keeps its Linen & Sunset theme)
- Brand palette (Midnight Navy + Fulfillment Orange remains the only color system)
