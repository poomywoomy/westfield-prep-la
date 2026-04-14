

## Plan: Update B2B Services List and Pricing from Screenshot

### Summary
Remove Additional Label, Shrink Wrapping, Kitting, and Bundling from B2B services. Add new B2B-specific services matching the screenshot pricing structure: Base Order Fee, Per-Unit Pick Fee, Case/Carton Picking, and Hourly Rate (VAS/B2B Prep).

### Changes

**File: `src/components/admin/CreateQuoteDialog.tsx`**

**1. Update `B2B_SERVICES` array:**
```typescript
const B2B_SERVICES = [
  "Base Order Fee",
  "Per-Unit Pick Fee",
  "Case/Carton Picking",
  "Hourly Rate (VAS/B2B Prep)",
  "Pick & Pack",
  "Palletizing",
  "Bubble Wrapping",
  "Shipment Box",
  "Carton Usage",
  "Custom Entry"
];
```

**2. Add `AUTO_NOTES` for new services:**
```typescript
"Base Order Fee": "Covers dropping the order, printing the packing slip, and staging the box",
"Per-Unit Pick Fee": "Per unit picked from inventory for B2B orders",
"Case/Carton Picking": "Per master carton picked, for shipping full sealed cartons without opening",
"Hourly Rate (VAS/B2B Prep)": "Per hour for value-added services, big-box retail compliance, EDI integration, and custom prep",
```

**3. Add `DEFAULT_PRICES` for new services:**
```typescript
"Base Order Fee": 10,
"Per-Unit Pick Fee": 0.15,
"Case/Carton Picking": 3,
"Hourly Rate (VAS/B2B Prep)": 45,
```

### What stays
- Pick & Pack, Palletizing, Bubble Wrapping, Shipment Box, Carton Usage, Custom Entry remain in B2B list
- All other service lists (marketplace, self fulfillment, TikTok Shop) unchanged
- Standard operations unchanged

