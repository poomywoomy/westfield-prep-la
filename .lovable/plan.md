

## Plan: Remove Billing, Bill History, and Shipments from Admin UI

### Summary
Remove the three tabs (Billing, Bill History, Shipments) from the admin sidebar and dashboard. The underlying components and data remain intact -- this only hides them from the UI.

### Changes

**1. `src/components/app-sidebar-admin.tsx`**
- Remove `billing`, `billing-history`, and `shipments` from the `menuItems` array
- Remove unused icons (`DollarSign`, `History`, `Package`)
- Remove `shipments` and `billing` from `prefetchHandlers`

**2. `src/pages/AdminDashboard.tsx`**
- Remove lazy imports for `BillingTab`, `BillingHistoryTab`, `ShipmentsTab`
- Remove the three corresponding `<TabsContent>` blocks

