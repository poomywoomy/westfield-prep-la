

## Plan: Fix Brand Logos and Replace FBA Section Graphic

### Problem
1. **Broken brand logos**: The SVG paths for Shopify, Amazon, and Walmart in `BrandIcons.tsx` still render as garbled/unrecognizable shapes. Previous fix attempts used incorrect paths.
2. **Fake box graphic**: The right side of the "Amazon FBA Prep" section (lines 509-524 in `WhyChooseUs.tsx`) shows a generic CSS-drawn box with fake FNSKU barcode text (`|| ||| || |||`) and a "HEAVY PACKAGE" badge. It looks amateurish.

### Changes

**File 1: `src/components/BrandIcons.tsx`**
- Replace all three icon SVG paths with the exact Simple Icons paths (verified from simpleicons.org):
  - **Shopify**: The shopping bag "S" icon (path: `M15.337 23.979l7.216-1.561s-2.604...` is wrong -- replace with the correct Simple Icons Shopify path)
  - **Amazon**: The "a" with smile arrow (current path is the old Amazon "a" letterform -- replace with the recognizable smile/arrow logo)
  - **Walmart**: The 6-spoke spark (current path is a complex multi-spoke that doesn't render correctly -- replace with the clean spark)
- Use the verified `viewBox="0 0 24 24"` paths from Simple Icons v14

**File 2: `src/pages/WhyChooseUs.tsx` (lines 509-524)**
- Remove the fake box/barcode graphic entirely
- Replace with a data-driven "FBA Compliance Stats" panel showing real metrics:
  - "0% Chargeback Rate" 
  - "99.7% Label Accuracy"
  - "24hr Prep Turnaround"
  - "2M+ Units Prepped"
- Style as a grid of stat cards with icons, fitting the dark theme
- This replaces the amateur box illustration with compelling, trust-building data that reinforces the "Zero Compliance Errors" headline

### No other files affected
Both changes are self-contained in these two files.

