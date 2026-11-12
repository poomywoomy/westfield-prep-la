---
title: "Shopify Market-Based Shipping: What Changes by July 1, 2027"
slug: "shopify-market-based-shipping-2027"
excerpt: "Shopify is moving shipping setup from profiles into Markets. The change affects how rates combine, when orders split, and how fulfillment locations need to be configured before July 1, 2027."
meta_description: "Learn how Shopify shipping options by market change rates, split shipping, and checkout before July 1, 2027, plus a 3PL readiness checklist."
cover_image_url: "/blog-images/shopify-order-fulfillment-dashboard-warehouse.jpg"
category: "Shopify Fulfillment"
tags:
  - Shopify market-based shipping
  - Shopify shipping options by market
  - market-driven shipping
  - Shopify split shipping
  - Shopify shipping setup
  - Shopify fulfillment
author_name: "Westfield Team"
published: false
published_at: null
read_time_minutes: 8
---

> **Quick answer:** Shopify is moving merchant shipping setup away from product and location shipping profiles and into Markets. Opt-in began on October 1, 2026, and the new setup becomes the default for all shops by July 1, 2027. If your current shipping margins depend on several profile rates stacking together, matching rates inside one flat or order amount shipping option may no longer add up, which can leave you undercharging.

Shopify calls the new model **shipping options by market** and **market-driven shipping**. This article uses "Shopify market-based shipping" because that is the plain-language term many brands use when searching for the change. It is not a separate Shopify feature.

## What is changing

The old approach organizes shipping around product and location shipping profiles, with zones and rates determining what a customer pays. The new approach moves merchant-owned shipping configuration into Markets. Each market contains shipping options, each option contains rates, and each rate can have product and location conditions.

| Current building block | New building block | What it controls |
| --- | --- | --- |
| Shipping profiles | Markets | Where the merchant shipping setup is managed |
| Zones and profile rates | Shipping options such as Standard or Express | The delivery choices shown at checkout |
| Rates separated by profiles | Rates within an option | Price, transit time, and rate type |
| Product and location profile assignments | Product and location conditions on a rate | Which products and fulfillment locations a rate covers |

Shopify supports four rate types: **flat**, **order amount**, **weight-based**, and **carrier or app calculated**. Flat and order amount options can contain more than one rate. Weight-based and carrier or app calculated options contain one rate and price each shipment separately.

This is more than an admin redesign. Moving rates into the same option changes how checkout combines them. Product grouping, location conditions, and rate type now need to be reviewed together.

## Timeline to July 1, 2027

Shopify is rolling the changes out in stages rather than switching every store on one day.

| Date or stage | Shipping options by market | Split shipping | Ship and pickup in one order |
| --- | --- | --- | --- |
| October 1, 2026 | Opt-in begins, with new and eligible existing shops moving in stages | Auto-enablement begins in phases during October | Available as a Test Drive for Shopify Plus and Enterprise |
| January 2027 | Staged rollout continues | Phased rollout continues | Opens to new shops with both shipping and pickup enabled |
| April to July 1, 2027 | Migration continues | Rollout continues | Automatic enablement begins for eligible existing shops |
| By July 1, 2027 | Default experience for all shops | Default for qualified checkouts, with the toggle removed | On by default for eligible shops with shipping and pickup enabled |

The dates may share a final deadline, but the features do not share identical eligibility. In particular, do not assume every plan receives ship and pickup in one order on the same terms.

## How rates combine after the move

The key distinction is between rates within one shipping option and charges across different shipments or options.

### Flat and order amount rates use the highest match

Suppose your Standard option contains a $5 flat rate for standard products and a $12 flat rate for oversized products. A customer buys one item covered by each rate.

| Cart item | Matching rate in Standard |
| --- | --- |
| Standard product | $5 |
| Oversized product | $12 |
| **Total charged once** | **$12** |

The customer pays **$12 once, not $17**. Checkout selects the highest matching rate within that Standard option. It does not add the two matching rates together.

Order amount rates follow the same highest-match rule within one option. Their ranges also need to cover every cart total you expect. If a cart falls outside every defined range, no rate applies and the customer can hit a shipping error instead of completing checkout.

### Weight and calculated rates are priced per shipment

Weight-based and carrier or app calculated rates behave differently. They are calculated for each shipment. If a $5 weight-based rate applies to each of two shipments, the two $5 charges are added for a $10 total. Carrier and app calculated charges can likewise add up when an order splits.

The operational conclusion is direct: **brands that used stacked profile rates to recover freight or oversize costs can undercharge after migration unless they redesign the option, rate type, or product grouping.** A separate shipping option may be appropriate in some cases, while a per-shipment rate type may be appropriate in others. Test the actual checkout result before choosing.

## Split shipping becomes the default

By July 1, 2027, split shipping becomes the default for qualified checkouts. Customers can see that an order will arrive in more than one shipment and review the available shipping methods for each shipment.

When flat or order amount rates from the same shipping option cover the split, the customer pays that option once at the highest matching rate. Additional covered shipments are labeled **Included**. This tells the customer that shipping for those shipments is already covered rather than free as a separate promotion.

Accurate inventory by location matters because location availability and order routing influence how shipments form. If inventory records do not match the warehouse, checkout can present a shipment pattern that operations cannot execute cleanly. Review your [order fulfillment setup](/order-fulfillment) alongside product availability, routing priorities, and location conditions. Inventory placement that creates avoidable splits can affect both the checkout display and the shipping charge.

## Ship and pickup in one order

This related feature lets a customer choose shipping for some products and store pickup for others in one checkout. It is a separate rollout from shipping options by market.

It began as a Test Drive for Shopify Plus and Enterprise. Shopify then expands access to new shops with shipping and pickup enabled, followed by automatic enablement for eligible existing shops. By July 1, 2027, it is on by default for eligible shops. That eligibility language matters: the rollout is not an identical, unconditional release for every Shopify plan.

## What this means if you use a 3PL

Your shipping configuration and warehouse operation need to describe the same fulfillment reality. Start with these checks:

- Align each Shopify location with the warehouse that actually fulfills its orders.
- Keep product weights and package data accurate, especially for weight-based and calculated rates.
- Review whether inventory placement creates split shipments that serve no operational purpose.
- Test rate behavior before peak periods, using real product combinations and destination markets.
- Confirm that your store team and fulfillment partner are working from the same location and order routing rules.

For a broader operational baseline, use Westfield's [Shopify order fulfillment services guide](/blog/shopify-order-fulfillment-services-guide) and review your [Shopify channel setup](/sales-channels/shopify). Westfield Prep Center is a Duarte, California 3PL that supports Shopify and DTC fulfillment, kitting and bundling, and returns processing.

## Step 1: List every current shipping profile, rate name, and product exception

Export or document the current setup before changing it. Include general and custom profiles, zones, rate names, price ranges, free shipping thresholds, product exceptions, and location assignments. Mark any rate whose purpose is to recover an additional handling, oversize, or freight cost.

## Step 2: Find rates that are meant to stack

Flag combinations where two profile charges currently produce the intended checkout total. Pay special attention to oversized, heavy, freight, and mixed-product carts. These are the cases most likely to change when the rates become matches inside one flat or order amount option.

## Step 3: Rebuild those cases deliberately

Create separate shipping options where the customer should see distinct choices, or evaluate a rate type that still prices per shipment. Rebuild product collections and location conditions to support that logic. For order amount rates, cover the full range from zero upward without gaps.

## Step 4: Test five carts

Test one standard item; standard plus oversized; an order that splits across locations; a cart just below and just above the free shipping threshold; and ship plus pickup if the store is eligible. Record the option shown, the total charged, the shipment count, and any Included labels.

## Step 5: Recheck operations with your fulfillment partner

Confirm weights, package dimensions, locations, inventory placement, and order routing before opting in. Repeat the same tests after any location or catalog change. A checkout rate is only useful if the resulting shipment instructions can be executed as presented.

## Sources

1. Shopify, [Shopify's new fulfillment: How to prepare for what's coming in 2027](https://www.shopify.com/my/enterprise/blog/shopify-fulfillment-2027).
2. Shopify Help Center, [Understanding shipping options by market](https://help.shopify.com/en/manual/fulfillment/setup/shipping-options/understanding-shipping-options-by-market).
3. Shopify Help Center, [Setting up shipping options for a market](https://help.shopify.com/en/manual/fulfillment/setup/shipping-options/setting-up-shipping-options).
4. Shopify Help Center, [Split shipping in Shopify Checkout](https://help.shopify.com/en/manual/checkout-settings/split-shipping?section=Desktop).
5. Shopify developer changelog, [Market-driven shipping now available in feature preview](https://shopify.dev/changelog/posts/market-driven-shipping-now-available-in-feature-preview).

## FAQs

<details>
<summary>What is Shopify market-based shipping?</summary>

It is a plain-language search term for Shopify's move to shipping options by market, also called market-driven shipping. Merchant shipping setup moves from delivery profiles into Markets, where shipping options hold rates with product and location conditions.

</details>

<details>
<summary>When does Shopify market-based shipping become the default?</summary>

Opt-in began on October 1, 2026. Shopify is rolling the setup out in stages, and it becomes the default experience for all shops by July 1, 2027.

</details>

<details>
<summary>Do Shopify shipping rates still add together?</summary>

Within one flat or order amount shipping option, only the highest matching rate is charged once. Weight-based and carrier or app calculated rates are calculated per shipment, so split shipment charges can add together. Separate shipping options can also add together.

</details>

<details>
<summary>What happens when an order ships in more than one package?</summary>

Qualified checkouts show that the order will arrive in multiple shipments. If the same flat or order amount shipping option covers those shipments, the customer pays the highest matching rate once and additional covered shipments are labeled Included.

</details>

<details>
<summary>Do all Shopify stores get ship and pickup in one order?</summary>

No, not on identical terms. It began as a Test Drive for Shopify Plus and Enterprise. Shopify expands it to eligible shops with shipping and pickup enabled, with eligible shops receiving it by default by July 1, 2027.

</details>

## Review the setup before the deadline

If your Shopify brand is unsure how the new rate behavior affects fulfillment, [talk to Westfield about your Shopify fulfillment setup](/contact). Bring your current profiles, product exceptions, location list, and test cart results so the discussion stays grounded in your actual operation.
