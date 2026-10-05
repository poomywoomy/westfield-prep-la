// Page content data shared between the page component and its route fact sheet.

export const faqData = [
  {
    question: "What is a West Coast fulfillment center?",
    answer:
      "A West Coast fulfillment center is a third-party warehouse in the western United States that stores your inventory and ships orders directly to your customers. Operating from Los Angeles, it shortens transit times to western states, lowers parcel zone costs, and sits next to the Ports of Los Angeles and Long Beach so imported inventory becomes sellable faster.",
  },
  {
    question: "What is the difference between a West Coast 3PL and a prep center?",
    answer:
      "A prep center prepares inventory for a marketplace, typically labeling and packaging units before they ship to Amazon. A 3PL does that plus stores your inventory, picks and packs individual customer orders, handles returns, and integrates with your sales channels. Westfield operates as both, so brands running DTC and FBA together do not need two vendors or a transfer between them.",
  },
  {
    question: "Why use a West Coast 3PL instead of a Midwest or East Coast one?",
    answer:
      "If a meaningful share of your customers are in California, the Pacific Northwest, or the Southwest, a West Coast 3PL reaches them in one to two days instead of four to five, at a lower parcel zone. If you import from Asia, a West Coast location also removes an expensive inland freight leg after your container lands.",
  },
  {
    question: "How fast can you ship to West Coast customers from Los Angeles?",
    answer:
      "Ground shipments reach anywhere in California in one day, Nevada and Arizona in one to two days, and the Pacific Northwest in two days. Mountain states take two to three days, and coast-to-coast ground is four to five days. Expedited air is available for time-sensitive orders.",
  },
  {
    question: "Do you serve customers outside the West Coast?",
    answer:
      "Yes. We fulfill nationwide to all 50 states from our Los Angeles facility. Many brands run us as their primary or sole node, and some pair us with an eastern warehouse for split-inventory coverage.",
  },
  {
    question: "Should I split inventory between an East Coast and West Coast warehouse?",
    answer:
      "Splitting makes sense when your order volume is high enough that the parcel savings on eastern orders exceed the cost of duplicated safety stock, a second integration, and split receiving. Below that point a single West Coast node with the right carrier mix usually wins. We will model it against your actual destination mix before recommending it.",
  },
  {
    question: "What order volume is your West Coast fulfillment built for?",
    answer:
      "Our operation is purpose-built for brands shipping around 1,000 or more orders per month, where consistency, integration accuracy, and same-day cutoffs matter most. That is a sweet spot rather than a hard minimum, and we review each brand individually.",
  },
  {
    question: "How much does West Coast fulfillment cost?",
    answer:
      "Pricing is built around your order profile: per-unit receiving, monthly storage, and per-order pick and pack, with prep and special handling priced separately. Volume, SKU count, and units per order all affect the rate, so we quote each brand individually rather than publishing a single flat number.",
  },
  {
    question: "Which sales channels do you integrate with?",
    answer:
      "We integrate with Shopify, Amazon, and TikTok Shop, plus a range of marketplaces and order management platforms. Orders import automatically, inventory syncs in real time, and tracking numbers write back to the channel without manual work.",
  },
  {
    question: "Can you receive containers directly from the port?",
    answer:
      "Yes. We handle direct container drayage and same-day devanning for containers arriving at the Ports of Los Angeles and Long Beach. Inventory is counted, QC photographed, and made sellable in your portal, typically within 24 hours of arrival.",
  },
  {
    question: "How long does onboarding take?",
    answer:
      "Most brands go live within two to three weeks. That covers the channel integration, SKU setup and mapping, packaging and insert requirements, your first inbound shipment, and a test order cycle before we cut over live traffic.",
  },
  {
    question: "Can I visit your warehouse?",
    answer:
      "Our Los Angeles facility is not open for public visits. As a service-area business we manage client inventory remotely, and you get full visibility through the client portal along with QC photos on receiving, returns, and any discrepancy.",
  },
  {
    question: "What happens during peak season?",
    answer:
      "We plan peak capacity with each client ahead of Q4, including forecast order volumes, inbound cutoff dates for holiday inventory, added labor, and carrier pickup schedules. Same-day cutoffs are held through Black Friday and Cyber Monday rather than quietly suspended.",
  },
  {
    question: "How do you handle inventory accuracy and cycle counts?",
    answer:
      "Every movement is written to an inventory ledger, so on-hand quantity is the sum of receipts, adjustments, shipments, and returns rather than a manually maintained number. Cycle counts run against that ledger and any variance is logged as a visible discrepancy rather than silently corrected.",
  },
];

export const serviceData = {
  serviceType: "LogisticsService",
  name: "West Coast 3PL and Fulfillment Services",
  description:
    "West Coast 3PL and ecommerce fulfillment operated from a Los Angeles warehouse, including DTC pick and pack, Amazon FBA prep, port-adjacent container receiving, storage, kitting, and returns processing for brands shipping nationwide.",
  features: [
    "West Coast Order Fulfillment",
    "West Coast 3PL Warehousing",
    "1 to 2 Day Western US Delivery",
    "Port of LA and Long Beach Container Receiving",
    "Amazon FBA Prep",
    "Shopify Fulfillment",
    "TikTok Shop Fulfillment",
    "Storage and Warehousing",
    "Kitting and Bundling",
    "Returns Processing",
  ],
};
