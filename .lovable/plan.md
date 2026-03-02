
# Billing Pricing Template Updates

## Summary
Update the standard operations and fulfillment service templates across the pricing system to reflect new service names, prices, and auto-notes.

## Changes Overview

### 1. Standard Operations Service List Updates
**Files:** `ClientPricingTab.tsx`, `CreateQuoteDialog.tsx`

Update `STANDARD_SERVICES` array:
- **"Monthly Deposit"** becomes **"Account Startup Fee"** (one-time $500 charge)
  - Auto-note: "One-time charge for WMS training, WMS usage, and account support"
- **Remove** "Cubic Feet Storage"
- **Replace** with **"Pallet Storage"** (keep existing "Pallet Receiving" and "Carton Receiving")
- **Remove** "Bin Storage" (single entry) and replace with three separate entries:
  - **"Small Bin Storage"** (default price: $4)
  - **"Medium Bin Storage"** (default price: $5)
  - **"Large Bin Storage"** (default price: $6)
- **Add** "Returns Handling"
  - Auto-note: "Covers receiving, inspection, client consultation on disposition, and processing of return actions"
- Keep "Shelf Storage" and "Custom Entry"

New `STANDARD_SERVICES` list:
```text
Account Startup Fee
Pallet Receiving
Carton Receiving
Pallet Storage
Small Bin Storage
Medium Bin Storage
Large Bin Storage
Shelf Storage
Returns Handling
Custom Entry
```

### 2. Update `STORAGE_BILLING_NOTES` in `CreateQuoteDialog.tsx`
- Remove "Bin Storage" and "Cubic Feet Storage" entries
- Add:
  - "Small Bin Storage": "Per small bin, per month"
  - "Medium Bin Storage": "Per medium bin, per month"
  - "Large Bin Storage": "Per large bin, per month"
  - "Pallet Storage": "Per pallet, per month"

### 3. Marketplace Services Updates (Amazon FBA, TikTok Shop, Walmart WFS)
**Files:** `ClientPricingTab.tsx`, `CreateQuoteDialog.tsx`

Add to `MARKETPLACE_SERVICES`:
- **"Polybag Usage"** with auto-note: "Client will be charged for materials used at Westfield pricing, depends on size utilized"
- **"Carton Usage"** with auto-note: "Client will be charged for materials used at Westfield pricing, depends on size utilized"

These will have price displayed as "varies" (stored as 0 with the note indicating variable pricing).

### 4. Self Fulfillment Services Updates
Add to `SELF_FULFILLMENT_SERVICES`:
- **"Polybag Usage"** (same auto-note as marketplace)
- **"Carton Usage"** (same auto-note as marketplace)

### 5. BillingEntryDialog Monthly Deposit Logic
Update all references from "Monthly Deposit" to "Account Startup Fee" in `BillingEntryDialog.tsx` so the special payment handling (auto-create deposit payment, exclude from charges) applies to the renamed service.

### 6. Auto-Notes System
Implement an `AUTO_NOTES` lookup map that pre-fills the notes field when a service is selected:

```typescript
const AUTO_NOTES: Record<string, string> = {
  "Account Startup Fee": "One-time charge for WMS training, WMS usage, and account support",
  "Returns Handling": "Covers receiving, inspection, client consultation on disposition, and processing of return actions",
  "Polybag Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Carton Usage": "Client will be charged for materials used at Westfield pricing, depends on size utilized",
  "Small Bin Storage": "Per small bin, per month",
  "Medium Bin Storage": "Per medium bin, per month",
  "Large Bin Storage": "Per large bin, per month",
  "Pallet Storage": "Per pallet, per month",
};
```

When a service is selected from the dropdown (in both `ClientPricingTab` and `CreateQuoteDialog`), if the service has an auto-note and the notes field is currently empty, auto-fill the notes.

## Files to Modify
1. **`src/components/admin/ClientPricingTab.tsx`** -- Update `STANDARD_SERVICES`, `MARKETPLACE_SERVICES`, `SELF_FULFILLMENT_SERVICES`, add auto-notes logic
2. **`src/components/admin/CreateQuoteDialog.tsx`** -- Same service list updates, update `STORAGE_BILLING_NOTES`, add auto-notes
3. **`src/components/admin/BillingEntryDialog.tsx`** -- Rename "Monthly Deposit" references to "Account Startup Fee"

## Technical Notes
- Existing clients with "Monthly Deposit" or "Cubic Feet Storage" in their saved pricing will not be affected (their data stays as-is in the database). Only the dropdown options for new pricing entries change.
- The "varies" price for Polybag/Carton Usage will be stored as 0 in the database. The note clarifies that pricing is variable.
- The auto-notes only pre-fill when the notes field is empty, so admins can still override.
