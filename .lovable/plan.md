

## Plan: Update Default Prices for Returns Handling, Carton Receiving, and Pallet Receiving

### Summary
Add three entries to the `DEFAULT_PRICES` map so these services auto-fill with the correct prices.

### Changes

**File: `src/components/admin/CreateQuoteDialog.tsx`**

Update `DEFAULT_PRICES` (line 69-74) to add the three new defaults:

```typescript
const DEFAULT_PRICES: Record<string, number> = {
  "Account Startup Fee": 500,
  "Small Bin Storage": 4,
  "Medium Bin Storage": 5,
  "Large Bin Storage": 6,
  "Returns Handling": 1,
  "Carton Receiving": 3,
  "Pallet Receiving": 50,
};
```

This ensures these three services pre-fill with the correct dollar amounts when selected or when the dialog opens with pre-populated standard items.

