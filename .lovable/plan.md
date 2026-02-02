

# Fix Brand Icons with Correct SVG Logos

## The Problem
The current SVG paths in `src/components/BrandIcons.tsx` are incorrect and don't represent the actual brand logos:
- **Shopify**: Shows a malformed shape instead of the shopping bag icon
- **Amazon**: Shows illegible text-like paths instead of the arrow smile
- **Walmart**: Shows an angular shape instead of the spark/sunburst logo  
- **TikTok**: Shows a generic shape instead of the musical note

## The Solution
Replace the SVG paths with the correct, official brand logo paths.

## File to Modify
`src/components/BrandIcons.tsx`

## Correct Brand Logos

### Shopify (Shopping Bag with Checkmark)
The iconic green shopping bag with an "S" shape

### Amazon (Smile Arrow)
The distinctive arrow that goes from A to Z, forming a smile

### Walmart (Spark/Sunburst)
The 6-pointed spark/sun logo

### TikTok (Musical Note)
The distinctive "d" shaped musical note logo

## Technical Changes

Update the SVG paths in `BrandIcons.tsx`:

1. **ShopifyIcon** - Replace with the correct Shopify shopping bag SVG path from Simple Icons
2. **AmazonIcon** - Replace with the Amazon smile arrow SVG path
3. **WalmartIcon** - Replace with the Walmart spark/sunburst SVG path
4. **TikTokIcon** - The current path looks correct for TikTok, but may need adjustment

All icons will use:
- `viewBox="0 0 24 24"` for consistency
- `fill={color}` for proper color inheritance
- Correct brand-accurate SVG paths from Simple Icons project

## Visual Result
After the fix, the social proof bar will display:
- A green Shopify bag icon
- An orange Amazon smile arrow
- A blue Walmart spark
- A white TikTok musical note

All properly recognizable as their respective brands.

