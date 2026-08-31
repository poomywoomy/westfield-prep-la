# Create Quote — service and pricing updates

All changes are inside the quote builder (and its PDF output). No data model or billing logic changes.

## 1. Channel types
- Rename "Self Fulfillment" to "Direct to Consumer", and have it auto-populate its standard line items when added (same behavior as Standard Operations).
- Merge "Amazon FBA", "Walmart WFS", and "TikTok Shop" into a single channel called "Marketplace Fulfillment" that auto-populates the marketplace line items.
- Final channel list: Marketplace Fulfillment, Direct to Consumer, B2B.

## 2. Storage
- Remove "Shelf Storage" entirely (service option, description, and $20 default).
- Add "Palletizing" to Standard Operations at $25 per pallet, described as a per-pallet build and wrap charge.

## 3. Prices
- FNSKU Label: $0.70
- Polybox+Label: $1.30
- Bubble Wrap / Bubble Wrapping: $0.50
- Bundling: $0.50
- Additional Label: $0.20
- Carton Usage: stays $0

## 4. Removed / manual-only services
- "Shipment Box" removed entirely from every service list and its description/price maps.
- "Additional Label" and "Bubble Wrap" / "Bubble Wrapping" are no longer auto-added when a channel section is created. They remain selectable so they can be added manually per quote.

## Technical notes
- `src/components/admin/CreateQuoteDialog.tsx`: update `FulfillmentSection["type"]` union and `CHANNEL_TYPES`; collapse `MARKETPLACE_SERVICES` usage to the single merged channel; rename `SELF_FULFILLMENT_SERVICES` usage to Direct to Consumer and add it to `CHANNEL_DEFAULT_SERVICES`; drop `Shelf Storage` and `Shipment Box` from `STANDARD_SERVICES`, `STORAGE_BILLING_NOTES`, `AUTO_NOTES`, `DEFAULT_PRICES`, and all service arrays; add `Palletizing` to `STANDARD_SERVICES` with a $25 default; set the new `DEFAULT_PRICES` values; filter Additional Label and Bubble Wrap(ping) out of `CHANNEL_DEFAULT_SERVICES` only.
- Existing saved quotes that still carry old section types or removed services keep rendering their stored values; only new selections use the updated lists.
