

## Plan: Fix Why Choose Us Page Lighting and Brand Logos

### Problem
1. **Dark lighting**: The page background uses `--wcu-bg-primary: 215 50% 7%` (near-black navy) with similarly dark card/section backgrounds, making the page feel very dark and hard to read.
2. **Wrong brand logos**: The SVG paths in `BrandIcons.tsx` for Shopify, Amazon, and Walmart are incorrect/garbled -- they don't render recognizable logos.

### Changes

**File 1: `src/components/BrandIcons.tsx`**
- Replace the SVG paths for `ShopifyIcon`, `AmazonIcon`, and `WalmartIcon` with correct, recognizable SVG paths from Simple Icons (official open-source brand SVGs).
- Shopify: the shopping bag "S" logo
- Amazon: the "a" with smile arrow
- Walmart: the spark/sunburst (6-spoke)

**File 2: `src/index.css`**
- Lighten the Why Choose Us dark theme CSS variables:
  - `--wcu-bg-primary`: Lighten from `215 50% 7%` to ~`215 40% 12%`
  - `--wcu-bg-secondary`: Lighten from `217 37% 12%` to ~`217 30% 16%`
  - `--wcu-bg-card`: Lighten from `218 33% 15%` to ~`218 28% 20%`
  - `--wcu-bg-dark-card`: Lighten from `217 33% 18%` to ~`217 28% 24%`

This brightens backgrounds while maintaining the dark premium aesthetic. Text contrast improves across the page.

### No other files affected
The WhyChooseUs page and other components reference these variables/icons, so changes propagate automatically.

