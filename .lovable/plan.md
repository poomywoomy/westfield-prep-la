## Problem

The trust-bar logos on `/launchpad` and `/why-choose-us` look glitched (Walmart renders as vertical bars, Amazon/TikTok look like abstract blobs). They use the custom inline SVGs in `src/components/BrandIcons.tsx`, where several paths are simplified/incorrect.

The `/integrations` page already renders correct, recognizable brand logos because it uses the **Simple Icons** package (`react-icons/si`) — `SiShopify`, `SiAmazon`, `SiWalmart`, `SiTiktok`. These are the industry-standard, accurate vector logos.

## Fix

Swap the broken `BrandIcons` imports for the matching `react-icons/si` icons in the two affected pages — same approach already proven on the Integrations page. No other pages or files change.

### 1. `src/pages/Launchpad.tsx`
- Remove import: `ShopifyIcon, AmazonIcon, TikTokIcon, WalmartIcon` from `@/components/BrandIcons`
- Add import: `SiShopify, SiAmazon, SiTiktok, SiWalmart` from `react-icons/si`
- In the trust-pill row (~line 209), swap each `Icon` reference to the `Si*` version. Keep the existing `h-4 w-4` sizing and pill styling untouched.

### 2. `src/pages/WhyChooseUs.tsx`
- Remove import: `ShopifyIcon, AmazonIcon, WalmartIcon, TikTokIcon` from `@/components/BrandIcons`
- Add import: `SiShopify, SiAmazon, SiWalmart, SiTiktok` from `react-icons/si`
- In the social-proof bar (~lines 270–285), swap each icon to the `Si*` equivalent. Replace `size={32}` with `className="w-8 h-8 text-[#brandColor]"` (react-icons sizing convention). Keep the existing brand colors:
  - Shopify `#96BF48`
  - Amazon `#FF9900`
  - Walmart `#0071DC`
  - TikTok white

### What stays the same
- `BrandIcons.tsx` itself is left alone — other pages still use it and the per-rule constraint is to centralize SVGs there. We're only swapping the *consumers* on these two pages to match the working Integrations pattern.
- Layout, spacing, colors, surrounding copy: untouched.
- Header / Footer / Logo: untouched (per project rule).

## Result
Both pages will show the same crisp, recognizable Shopify / Amazon / Walmart / TikTok logos that already render correctly on `/integrations`.
