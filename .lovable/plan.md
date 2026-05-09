## Goal

Give each of the 7 Launchpad services its own **unique visual identity** in both:
1. **The service card** in the "What we help with" grid
2. **The detail modal** that opens when you click "View details"

Right now every card and every modal looks the same (white card, black icon tile, terracotta link, identical Dialog shell). We will replace that uniform treatment with 7 distinct styles so each service feels like its own product.

## Per-service visual identity

Each service gets a dedicated palette + a distinct card layout treatment + a distinct modal treatment.

| # | Service | Palette | Card style | Modal style |
|---|---|---|---|---|
| 01 | Shopify Website Creation | Shopify green `#5E8E3E` on cream | Asymmetric card, big number `01` watermark in green | Side-sheet from the right, green accent rail, "build sprint" timeline |
| 02 | Amazon Seller Central Setup | Amazon navy `#131A22` + orange `#FF9900` | Dark card with orange icon tile and orange underline | Centered modal, dark navy header band with orange chips, checklist layout |
| 03 | A+ Content & Storefront | Deep plum `#3D1E4E` + soft lilac | Card with subtle plum gradient and serif headline | Wide modal, two-column "module gallery" preview |
| 04 | Storefront Design | Charcoal `#1C1C1C` + warm sand | Editorial card, oversized typography, thin black border | Full-bleed modal with magazine grid (deliverables as image-style tiles) |
| 05 | Product 3D Imaging | Electric blue `#2B6CFF` + near-black | Card with grid/blueprint background pattern | Dark modal with neon-blue accents, "render queue" stepper |
| 06 | Studio Photography | Terracotta `#C2654A` + bone | Card with film-strip footer (3 placeholder frames) | Modal with horizontal scroll "contact sheet" of deliverables |
| 07 | Listing Optimization & Copy | Ink `#0E0E0E` + highlighter yellow | Card styled like a typed page, monospace eyebrow, yellow highlight on key phrase | Modal styled like a notebook: lined background, numbered bullets, yellow marker accents |

All palettes still live within the existing site warmth (cream `#f6f1ea` page bg stays). Service-specific colors are scoped to that service's card and modal only — global tokens are not changed.

## Implementation

### 1. Extend `LAUNCHPAD_SERVICES` data
Add a `theme` object per service:
```ts
theme: {
  accent: string;        // hex
  accentSoft: string;    // hex
  ink: string;           // hex (text on accent)
  cardVariant: 'shopify' | 'amazon' | 'aplus' | 'storefront' | 'imaging' | 'photo' | 'listing';
  modalVariant: 'side-sheet' | 'dark-checklist' | 'gallery' | 'magazine' | 'render-queue' | 'contact-sheet' | 'notebook';
}
```

### 2. New card components (`src/components/launchpad/cards/`)
One file per variant: `ShopifyCard.tsx`, `AmazonCard.tsx`, `APlusCard.tsx`, `StorefrontCard.tsx`, `ImagingCard.tsx`, `PhotoCard.tsx`, `ListingCard.tsx`. Each receives the `LaunchpadService` and an `onOpen` handler. The grid in `Launchpad.tsx` switches on `theme.cardVariant`.

The cards still align to the same grid cell height so the "What we help with" section stays tidy, but the *interior* of each card is unique (background, typography, accent stripes, icon treatment, footer).

### 3. New modal components (`src/components/launchpad/modals/`)
One file per variant matching the table above. Each is its own Radix Dialog with custom `DialogContent` styling (different widths, side vs center, dark vs light, custom header layouts). `ServiceDetailModal.tsx` becomes a thin router that renders the right modal based on `theme.modalVariant`.

All modals keep the same final CTA: **Get pricing for this service** → `/contact?service=launchpad&focus=<slug>` (unchanged behavior).

### 4. Page wiring
`src/pages/Launchpad.tsx` "What we help with" section maps services to the right card component. Modal state (`activeService`) stays the same — only the rendered modal varies.

## Out of scope
- "Build your launch stack" picker section (left rail + preview) — untouched.
- FAQ "Operator's Notebook" — untouched.
- Hero, header, footer, contact form — untouched.
- No DB / edge function / route changes.

## Files

**New:**
- `src/components/launchpad/cards/{Shopify,Amazon,APlus,Storefront,Imaging,Photo,Listing}Card.tsx` (7 files)
- `src/components/launchpad/modals/{SideSheet,DarkChecklist,Gallery,Magazine,RenderQueue,ContactSheet,Notebook}Modal.tsx` (7 files)

**Edited:**
- `src/components/launchpad/launchpadServices.ts` — add `theme` per service
- `src/components/launchpad/ServiceDetailModal.tsx` — becomes a variant router
- `src/pages/Launchpad.tsx` — services grid renders per-variant card component
