

## Plan: Auto-Descriptions, Service List Updates, and Pre-populated Standard Operations

### Summary
Three changes to the quote builder: (1) add auto-descriptions to every selectable service shown in dropdowns, (2) remove Kitting and Polybag Usage from Amazon FBA/Walmart WFS and copy carton usage wording to Shipment Box, (3) pre-populate standard operations with all items + Account Startup Fee when the dialog opens.

### Changes

**File: `src/components/admin/CreateQuoteDialog.tsx`**

**1. Expand `AUTO_NOTES` for all services:**
```typescript
const AUTO_NOTES: Record<string, string> = {
  "Account Startup Fee": "One-time charge for WMS training, WMS usage, and account support",
  "Pallet Receiving": "Per pallet received and checked into warehouse",
  "Carton Receiving": "Per carton received and checked into warehouse",
  "Pallet Storage": "Per pallet, per month",
  "Small Bin Storage": "Per small bin, per month",
  "Medium Bin Storage": "Per medium bin, per month",
  "Large Bin Storage": "Per large bin, per month",
  "Shelf Storage": "Per shelf, per month",
  "Returns Handling": "Covers receiving, inspection, client consultation on disposition, and processing of return actions",
  "FNSKU Label": "Per unit, applied to each product for Amazon FBA compliance",
  "Polybox+Label": "Per unit, polybagged and labeled for marketplace compliance",
  "Bubble Wrap": "Per unit, bubble wrapped for protection during transit",
  "Bundling": "Per bundle, combining multiple items into a single sellable unit",
  "Additional Label": "Per label, any extra labeling beyond standard requirements",
  "Shipment Box": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Polybag Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Carton Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Single Product": "Per order, pick and pack for single-item orders",
  "Kitting": "Per kit assembled, combining components into a single unit",
  "Bubble Wrapping": "Per unit, bubble wrapped for shipping protection",
};
```

**2. Update `MARKETPLACE_SERVICES` -- remove Kitting and Polybag Usage:**
```typescript
const MARKETPLACE_SERVICES = [
  "FNSKU Label", "Polybox+Label", "Bubble Wrap", "Bundling",
  "Additional Label", "Shipment Box", "Carton Usage", "Custom Entry"
];
```

**3. Show description in dropdown `SelectItem`:**
Each service option renders its auto-note as a subtitle beneath the name.

**4. Pre-populate standard items on dialog open:**
When the dialog opens (and not in team quote mode), initialize `standardItems` with all `STANDARD_SERVICES` (except "Custom Entry") pre-added, each with their `AUTO_NOTES` and `DEFAULT_PRICES` applied. Account Startup Fee will be first with $500 pre-filled.

Update `resetForm` accordingly so re-opening starts fresh with the same pre-populated state.

### What Stays
- Self Fulfillment and TikTok Shop service lists unchanged
- Team quote mode still clears everything
- PDF generation unchanged
- All save/edit/delete functionality unchanged

