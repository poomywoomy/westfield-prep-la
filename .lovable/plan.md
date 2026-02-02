
# Replace Text Logos with Proper Brand Icons

## Overview
Replace the text-based platform logos in the Social Proof Bar with the actual SVG brand icons that already exist in the codebase.

## Current State (Lines 266-275 in WhyChooseUs.tsx)
```jsx
<div className="border-t border-white/10 pt-10 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
  <span className="text-xl font-bold font-serif">SHOPIFY PLUS</span>
  <span className="text-xl font-bold tracking-tighter">
    amazon<span className="italic">FBA</span>
  </span>
  <span className="text-xl font-bold">Walmart Marketplace</span>
  <span className="text-xl font-bold flex items-center gap-1">
    <span className="bg-white text-black p-0.5 text-xs rounded">Tik</span>Tok Shop
  </span>
</div>
```

## Solution
Use the existing `BrandIcons` from `src/components/BrandIcons.tsx`:
- `ShopifyIcon`
- `AmazonIcon`
- `WalmartIcon`
- `TikTokIcon`

## Implementation Details

### File: `src/pages/WhyChooseUs.tsx`

**Add Import:**
```tsx
import { ShopifyIcon, AmazonIcon, WalmartIcon, TikTokIcon } from "@/components/BrandIcons";
```

**Replace Social Proof Bar:**
```tsx
{/* Social Proof Bar */}
<div className="border-t border-white/10 pt-10 flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 hover:opacity-100 transition-all duration-500">
  <div className="flex items-center gap-2">
    <ShopifyIcon size={32} className="text-[#96BF48]" />
    <span className="text-lg font-semibold text-white/80">Shopify Plus</span>
  </div>
  <div className="flex items-center gap-2">
    <AmazonIcon size={32} className="text-[#FF9900]" />
    <span className="text-lg font-semibold text-white/80">Amazon FBA</span>
  </div>
  <div className="flex items-center gap-2">
    <WalmartIcon size={32} className="text-[#0071DC]" />
    <span className="text-lg font-semibold text-white/80">Walmart</span>
  </div>
  <div className="flex items-center gap-2">
    <TikTokIcon size={32} className="text-white" />
    <span className="text-lg font-semibold text-white/80">TikTok Shop</span>
  </div>
</div>
```

## Visual Design
- **Icon Size:** 32px for clear visibility
- **Brand Colors:**
  - Shopify: `#96BF48` (green)
  - Amazon: `#FF9900` (orange)
  - Walmart: `#0071DC` (blue)
  - TikTok: White (standard on dark backgrounds)
- **Typography:** `text-lg font-semibold text-white/80` for labels
- **Spacing:** `gap-2` between icon and text, `gap-8 md:gap-12` between logo groups
- **Hover Effect:** Changed from grayscale filter to opacity transition (70% → 100%) for a cleaner effect with colored icons

## Files to Modify
1. `src/pages/WhyChooseUs.tsx` - Add import and update social proof bar section
