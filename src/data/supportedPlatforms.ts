import { PlatformData } from "@/components/sales-channels/PlatformCard";

export const supportedPlatforms: PlatformData[] = [
  // Featured Platforms
  {
    key: "shopify",
    name: "Shopify",
    tagline: "Primary Integration",
    description:
      "Shopify is the leading e-commerce platform powering millions of online stores. Our direct integration provides seamless real-time order imports, automatic inventory synchronization, and instant tracking updates. Perfect for DTC brands looking for reliable, fast fulfillment from Los Angeles.",
    features: [
      "Real-time order sync via webhooks",
      "Automatic inventory level updates",
      "Direct tracking number injection",
      "Multi-location inventory support",
      "Shopify Plus compatible",
      "Returns processing integration",
    ],
    bestFor: ["DTC Brands", "Subscription Boxes", "Fashion & Apparel", "Health & Beauty"],
    setupTime: "< 5 min",
    featured: true,
    path: "/sales-channels/shopify",
    brandColor: "#5E8E3E",
  },
  {
    key: "amazon",
    name: "Amazon",
    tagline: "FBA Prep Specialists",
    description:
      "As Amazon FBA prep specialists, we handle everything from receiving your inventory to preparing it for Amazon's fulfillment centers. Our LA location offers fast turnaround and compliance with all Amazon requirements including FNSKU labeling, poly bagging, and shipment planning.",
    features: [
      "FBA prep and forwarding",
      "FNSKU labeling and compliance",
      "Poly bagging and bundling",
      "Amazon-optimized box sizes",
      "Inventory replenishment tracking",
      "Multi-node shipment splitting",
    ],
    bestFor: ["FBA Sellers", "Private Label", "Wholesale", "Arbitrage"],
    setupTime: "< 15 min",
    featured: true,
    path: "/sales-channels/amazon",
    brandColor: "#FF9900",
  },
  {
    key: "tiktok",
    name: "TikTok Shop",
    tagline: "48-Hour SLA Fulfillment",
    description:
      "TikTok Shop demands speed. Our integration ensures orders from your TikTok Shop are processed and shipped within TikTok's strict 48-hour SLA requirements. We handle the fulfillment complexity so you can focus on creating viral content.",
    features: [
      "48-hour SLA compliance",
      "Automatic order import",
      "Real-time inventory sync",
      "Tracking updates to TikTok",
      "High-volume capacity",
      "Peak season scalability",
    ],
    bestFor: ["Influencer Brands", "Viral Products", "Beauty & Cosmetics", "Trending Items"],
    setupTime: "< 10 min",
    featured: true,
    path: "/sales-channels/tiktok-shop",
    brandColor: "#000000",
  },
  // Regular Platforms
  {
    key: "walmart",
    name: "Walmart",
    tagline: "WFS Ready",
    description:
      "Walmart Marketplace is one of the largest e-commerce platforms in the US. We provide specialized fulfillment including WFS (Walmart Fulfillment Services) prep, compliance with Walmart's strict packaging standards, and support for 2-day shipping requirements.",
    features: [
      "WFS prep and forwarding",
      "Walmart packaging compliance",
      "2-day shipping support",
      "Order import and tracking",
      "Returns processing",
    ],
    bestFor: ["Home Goods", "Electronics", "Grocery", "Seasonal"],
    setupTime: "< 15 min",
    brandColor: "#0057A0",
  },
  {
    key: "etsy",
    name: "Etsy",
    tagline: "Handmade & Craft Focus",
    description:
      "Etsy sellers need fulfillment that matches the care they put into their products. We offer gentle handling for handmade items, custom packaging options, and the personal touch Etsy buyers expect. Perfect for artisan sellers scaling beyond home fulfillment.",
    features: [
      "Gentle handling for delicate items",
      "Custom branded packaging",
      "Gift wrapping options",
      "Small-batch inventory",
      "Made-to-order support",
    ],
    bestFor: ["Handmade Crafts", "Vintage Items", "Art Prints", "Jewelry"],
    setupTime: "< 10 min",
    brandColor: "#D5581D",
  },
  {
    key: "woocommerce",
    name: "WooCommerce",
    tagline: "WordPress Integration",
    description:
      "WooCommerce powers millions of WordPress-based stores. Our integration connects directly with your WooCommerce installation, providing automatic order imports, real-time inventory updates, and tracking number injection without manual work.",
    features: [
      "WordPress plugin integration",
      "Automatic order sync",
      "Real-time inventory updates",
      "Custom shipping methods",
      "Subscription order support",
    ],
    bestFor: ["WordPress Sites", "Subscription Products", "Custom Brands", "Niche Markets"],
    setupTime: "< 10 min",
    brandColor: "#674399",
  },
  {
    key: "bigcommerce",
    name: "BigCommerce",
    tagline: "Enterprise E-commerce",
    description:
      "BigCommerce is built for growing and enterprise businesses. Our integration matches BigCommerce's capabilities with enterprise-grade fulfillment, supporting high-volume operations, B2B workflows, and complex multi-channel inventory management.",
    features: [
      "Enterprise fulfillment",
      "High-volume processing",
      "Multi-channel inventory",
      "B2B order support",
      "Advanced reporting",
    ],
    bestFor: ["Growing Brands", "Enterprise", "B2B Sellers", "High Volume"],
    setupTime: "< 10 min",
    brandColor: "#121118",
  },
  {
    key: "faire",
    name: "Faire",
    tagline: "Wholesale Marketplace",
    description:
      "Faire connects brands with retailers worldwide. We provide specialized B2B fulfillment for Faire sellers, handling wholesale orders, pallet building, retailer compliance prep, and the professional presentation wholesale buyers expect.",
    features: [
      "Wholesale order fulfillment",
      "Bulk packaging",
      "Retailer compliance prep",
      "Pallet building",
      "Drop shipping to retailers",
    ],
    bestFor: ["Wholesale Brands", "Artisan Products", "Retail Vendors", "B2B"],
    setupTime: "< 10 min",
    brandColor: "#1A1A1A",
  },
  {
    key: "magento",
    name: "Magento",
    tagline: "Flexible & Customizable",
    description:
      "Magento (Adobe Commerce) offers maximum flexibility for custom e-commerce implementations. Our integration adapts to your Magento setup, supporting custom workflows, multi-store configurations, and complex business logic.",
    features: [
      "Custom platform integration",
      "Multi-store support",
      "B2B workflows",
      "Advanced automation",
      "Complex catalog handling",
    ],
    bestFor: ["Custom Businesses", "Enterprise", "B2B Operations", "Complex Catalogs"],
    setupTime: "< 15 min",
    brandColor: "#EE672F",
  },
  {
    key: "wix",
    name: "Wix",
    tagline: "Simple & Scalable",
    description:
      "Wix makes it easy for businesses to sell online without technical expertise. Our straightforward integration connects with your Wix store, handling orders automatically while you focus on growing your business.",
    features: [
      "Simple store integration",
      "Automatic order sync",
      "Inventory management",
      "Small business friendly",
      "Scalable solutions",
    ],
    bestFor: ["Small Businesses", "Startups", "Service-Based", "New E-commerce"],
    setupTime: "< 10 min",
    brandColor: "#0C6EFC",
  },
];

export const featuredPlatforms = supportedPlatforms.filter((p) => p.featured);
export const regularPlatforms = supportedPlatforms.filter((p) => !p.featured);
