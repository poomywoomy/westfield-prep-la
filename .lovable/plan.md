## Goal

1. Redesign the existing `/why-choose-us` page with a more modern, premium feel.
2. Keep the Launchpad section visible there as a teaser, but rewrite the messaging — it should NOT say "We'll build your brand for you."
3. Create a brand-new dedicated page for the Launchpad services covering Shopify dashboard setup, Amazon Seller Central setup, A+ content, product 3D imaging, model/photo shoot coordination, and general "get-your-product-off-the-ground" support.
4. Add the new page to the header navigation.

## New Messaging Direction

Instead of "Don't have a brand yet? We'll build one for you," the new positioning is a **support / launch services studio**:

- Headline option: **"Launch Faster. Sell Smarter."**
- Sub: "From your first Shopify dashboard to A+ content on Amazon and pro-grade product imagery — we help you get your product off the ground without hiring five agencies."

We position Westfield as a partner that *helps you launch and scale* (not as a brand-creation agency).

## Page 1 — Redesign `/why-choose-us` (`src/pages/WhyChooseUs.tsx`)

Modernize the existing sections with refreshed visuals (lighter card surfaces, glassmorphism accents, gradient orbs, sharper typography hierarchy) while keeping all current content blocks: Hero, Old Way vs Westfield Way, Stats, Trust/Compliance, FAQ.

**Launchpad section (lines 537–648) — rewrite:**
- New eyebrow chip: **WESTFIELD LAUNCHPAD**
- New H2: **"Launch Faster. Sell Smarter."**
- New sub-copy: "Shopify setup, Amazon Seller Central, A+ content, 3D product imagery, and pro photography — all under one roof. We help your product look launch-ready from day one."
- Replace the 3 service cards with 4 quick highlights:
  - **Shopify Dashboard Setup** — Store build, theme config, app stack, payments.
  - **Amazon Account & A+ Content** — Seller Central registration, brand registry, A+ modules, storefront.
  - **3D Product Imaging** — Photoreal renders that look like studio shots, no physical samples needed.
  - **Photo & Model Shoots** — Coordinated studio sessions with models, props, and lifestyle sets.
- Replace the "$2,499 Zero to One Package" pricing card with a softer **"What we help with"** support panel + a single CTA: **"Explore Launchpad Services"** → routes to new `/launchpad` page. Secondary CTA: "Book a Discovery Call" → `/contact`.
- Remove the "$500 shipping credits" copy.

Visual refresh of the rest of the page: tighter spacing, animated entry on scroll (framer-motion already in project), updated comparison cards with hover lift, new gradient hero accent. No content removed — only restyled.

## Page 2 — New `/launchpad` page

Create `src/pages/Launchpad.tsx` (modeled after `Hero` + section components — uses Header & Footer, single H1).

### Structure

1. **Hero** — Eyebrow "WESTFIELD LAUNCHPAD" • H1 "Launch Faster. Sell Smarter." • Sub-copy + dual CTAs ("Book a Discovery Call" → `/contact`, "View Pricing" → `/pricing`). Dark gradient background, floating platform chips (Shopify, Amazon, TikTok).
2. **What We Help With** — 6-card grid:
   - Shopify Dashboard Build
   - Amazon Seller Central Setup
   - A+ Content & Storefront
   - Product 3D Imaging
   - Studio Photo & Model Shoots
   - Listing Optimization & Copy
3. **3D Imaging vs Studio Shoots** — Split section explaining when to use renders vs real photo shoots; visual comparison block.
4. **How It Works** — 4-step timeline: Discovery → Asset Plan → Production → Launch.
5. **Why Sellers Use Launchpad** — 3 outcome metrics (faster launch, fewer vendors, conversion-ready assets).
6. **FAQ** — 5 questions (turnaround, do you need to be a fulfillment client, do you ship to studio, file formats delivered, ownership of assets).
7. **CTA Strip** — "Ready to launch?" → `/contact`.

Includes proper SEO via `Helmet` + `generateMetaTags` (`/launchpad`), single `<h1>`, `RouteCanonical`, all images alt-tagged, all section H2s.

## Routing & Navigation

- `src/App.tsx` — Add lazy import + `<Route path="/launchpad" element={<Launchpad />} />`.
- `src/components/Header.tsx` — Add **Launchpad** link to the desktop nav (next to Why Choose Us) and to the mobile menu using the same pattern as `/why-choose-us`.
- `public/sitemap.xml` — Add `/launchpad` entry.

## Constraints respected

- Header, Footer, and Logo untouched (only adding one nav link, not modifying structure).
- Single H1 per page.
- Address remains "Los Angeles, CA".
- No em dashes in copy.
- Uses existing brand colors (Midnight Navy / Orange) and Tailwind tokens.
- No new dependencies.

## Files

- Modify: `src/pages/WhyChooseUs.tsx`, `src/App.tsx`, `src/components/Header.tsx`, `public/sitemap.xml`
- Create: `src/pages/Launchpad.tsx`
