

## Plan: Remove WMS-Related Tabs from Admin Dashboard

Since you now have your own WMS, we'll remove these 5 tabs from the admin sidebar and dashboard:
1. **Shipment Requests**
2. **Support Tickets**
3. **Shopify Sync Center**
4. **Orders**
5. **Discrepancies**
6. **Inventory**

### Changes

**1. `src/components/app-sidebar-admin.tsx`**
- Remove menu items: `inventory`, `discrepancies`, `shopify-sync-center`, `orders`, `shipment-requests`, `support-tickets`
- Remove badge counts for discrepancies, shipment requests, support tickets
- Remove imports for `usePendingShipmentRequestsCount` and `useOpenSupportTicketsCount`
- Remove related prefetch handlers
- Remove unused icons from imports

**2. `src/pages/AdminDashboard.tsx`**
- Remove lazy imports for: `InventoryTab`, `DiscrepanciesTab`, `ShopifySyncCenter`, `OrdersTab`, `ShipmentRequestsTab`, `SupportTicketsTab`
- Remove corresponding `<TabsContent>` blocks for all 6 tabs
- Remove imports for `usePendingDiscrepancyCount`, `usePendingShipmentRequestsCount`, `useOpenSupportTicketsCount`
- Remove related state variables and props passed to `AppSidebarAdmin`
- Remove the `discrepancyCount`, `shipmentRequestsCount`, `supportTicketsCount` props from the sidebar component

### Remaining Admin Tabs
After removal, the admin dashboard will keep: Clients, Billing, Bill History, Shipments, Blog, Blog Research, SEO Audit, Industry News, Translations, Documents.

