

## Plan: Make TikTok Shop Use Same Services as Self Fulfillment

### Summary
Update the `getServiceOptions` function so TikTok Shop shows the same service list as Self Fulfillment (Single Product, Oversized Product, Bundling, Kitting, Bubble Wrapping, Polybag Usage, Carton Usage, Custom Entry).

### Changes

**File: `src/components/admin/CreateQuoteDialog.tsx`**

Update `getServiceOptions` (line ~278-282) to route TikTok Shop to `SELF_FULFILLMENT_SERVICES`:

```typescript
const getServiceOptions = (sectionType?: FulfillmentSection["type"]) => {
  if (!sectionType) return STANDARD_SERVICES;
  if (sectionType === "Self Fulfillment" || sectionType === "TikTok Shop") return SELF_FULFILLMENT_SERVICES;
  return MARKETPLACE_SERVICES;
};
```

This single-line change makes TikTok Shop offer the exact same dropdown options as Self Fulfillment. Amazon FBA and Walmart WFS remain on the marketplace list.

