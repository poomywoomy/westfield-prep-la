

## Plan: Remove Shopify Integrations from Dashboard/Login Areas

### What We're Doing
Removing all Shopify integration features from the admin and client dashboard areas since you're now using a 3rd party WMS. The public marketing pages (Shopify Fulfillment service page, blog posts, etc.) will remain untouched as they are for SEO and customer acquisition.

### Changes

**1. Client Dashboard (`src/pages/ClientDashboard.tsx`)**
- Remove `hasShopifyStore` state and the Shopify store detection query
- Remove the Shopify OAuth success callback handler
- Remove the conditional Orders tab that only shows when `hasShopifyStore` is true

**2. Client Settings (`src/pages/ClientSettings.tsx`)**
- Remove the "Shopify" tab from the tabs list (change from 2-column grid to single tab)
- Remove the `ClientShopifyTab` import and `<TabsContent value="shopify">` section
- Remove the Shopify Location ID field and validation logic from the Account tab
- Remove the `shopify-validate-location` function invocation code

**3. Edit Client Dialog (`src/components/admin/EditClientDialog.tsx`)**
- Remove `shopify_location_id` from form state and update payload
- Remove the Shopify Location ID input field and validate button
- Remove `shopify` from the fulfillment services checkboxes

**4. Create Client Dialog (`src/components/admin/CreateClientDialog.tsx`)**
- Remove `shopify` from the fulfillment services checkboxes

### What Stays
- All public-facing Shopify marketing pages (`/shopify-fulfillment`, `/sales-channels/shopify`, etc.)
- Blog posts mentioning Shopify
- The `fulfillment_services` enum value in the database (no schema change needed, just UI removal)
- Edge functions remain deployed but unused (can be cleaned up later)

