export const platformsData = {
  "Walmart Marketplace": {
    name: "Walmart Marketplace",
    description: "Major U.S. retailer e-commerce platform",
    fullDescription: `Walmart Marketplace is one of the largest e-commerce platforms in the United States, competing directly with Amazon. We provide specialized fulfillment for Walmart sellers including WFS (Walmart Fulfillment Services) prep and forwarding, as well as direct-to-consumer order fulfillment.

Our Los Angeles facility is strategically positioned to meet Walmart's strict packaging and labeling standards while ensuring fast 2-day shipping requirements are consistently met. We handle everything from receiving your products to preparing them according to Walmart's specific compliance requirements.`,
    features: [
      "WFS (Walmart Fulfillment Services) prep and forwarding",
      "Direct-to-consumer Walmart order fulfillment",
      "Compliance with Walmart's packaging and labeling standards",
      "Fast 2-day shipping requirements support",
      "Walmart-specific quality control processes"
    ],
    bestFor: ["Home Goods", "Electronics", "Grocery Items", "Seasonal Products"],
    integration: "API integration available for automated order import and inventory sync",
    setupTime: "3-5 business days"
  },
  "eBay": {
    name: "eBay",
    description: "Global online marketplace for auctions and fixed-price sales",
    fullDescription: `eBay remains one of the world's largest online marketplaces with millions of active buyers. We provide multi-channel fulfillment services specifically optimized for eBay sellers, handling everything from inventory management to order shipping.

Our service includes fast turnaround times essential for maintaining high seller ratings, professional packaging to reduce damage claims, and integration with eBay's shipping tools for streamlined operations.`,
    features: [
      "Fast order processing for maintaining seller ratings",
      "Professional packaging to minimize damage claims",
      "Integration with eBay shipping tools",
      "Multi-channel inventory management",
      "Returns processing and inspection"
    ],
    bestFor: ["Collectibles", "Electronics", "Fashion", "Auto Parts"],
    integration: "Direct API integration with eBay seller accounts",
    setupTime: "2-4 business days"
  },
  "Etsy": {
    name: "Etsy",
    description: "Marketplace for handmade, vintage, and craft items",
    fullDescription: `Etsy is the premier marketplace for handmade, vintage, and unique craft items. We understand the special care required for artisan products and offer fulfillment services that preserve the handmade quality and presentation that Etsy customers expect.

From gentle handling of delicate items to custom branded packaging that reflects your shop's aesthetic, we treat every Etsy order with the care it deserves.`,
    features: [
      "Gentle handling for handmade and delicate items",
      "Custom branded packaging options",
      "Gift wrapping and personalization services",
      "Small-batch inventory management",
      "Support for made-to-order workflows"
    ],
    bestFor: ["Handmade Crafts", "Vintage Items", "Art Prints", "Jewelry"],
    integration: "Etsy Shop API integration for order sync",
    setupTime: "2-3 business days"
  },
  "Target Plus": {
    name: "Target Plus",
    description: "Target's curated third-party marketplace",
    fullDescription: `Target Plus is Target's selective third-party marketplace featuring curated brands. As a Target Plus partner, you need a fulfillment provider that understands Target's high standards for quality, compliance, and customer experience.

We provide enterprise-level fulfillment services including retailer-specific compliance prep, quality control, and the fast shipping speeds Target customers expect.`,
    features: [
      "Target-specific compliance and labeling",
      "Enterprise fulfillment capabilities",
      "Strict quality control processes",
      "Fast shipping to meet Target standards",
      "Dedicated account management"
    ],
    bestFor: ["Home Decor", "Kitchen & Dining", "Baby Products", "Wellness"],
    integration: "Enterprise API integration with Target Plus accounts",
    setupTime: "5-7 business days for compliance setup"
  },
  "Instagram Shopping": {
    name: "Instagram Shopping",
    description: "Social commerce through Instagram posts and stories",
    fullDescription: `Instagram Shopping allows brands to sell directly through Instagram posts, stories, and the Shop tab. We provide seamless fulfillment for Instagram commerce, handling orders generated through your Instagram presence with the same care and speed your followers expect.

Perfect for visual brands and influencer-driven businesses, our service ensures your Instagram sales convert into delighted customers.`,
    features: [
      "Direct commerce integration with Instagram",
      "Fast fulfillment for social media-driven orders",
      "Photo-worthy packaging for user-generated content",
      "Influencer campaign fulfillment support",
      "Real-time inventory sync with Instagram Shop"
    ],
    bestFor: ["Beauty Products", "Fashion", "Lifestyle Brands", "Influencer Products"],
    integration: "Integration via Facebook Commerce Manager",
    setupTime: "2-3 business days"
  },
  "Facebook Shops": {
    name: "Facebook Shops",
    description: "Social selling through Facebook and Messenger",
    fullDescription: `Facebook Shops enables businesses to create online stores directly on Facebook and Instagram. We handle fulfillment for Facebook Shop orders, ensuring your social commerce success with reliable, fast shipping and professional presentation.

Our integration ensures seamless order flow from Facebook Shop to your customers' doorsteps.`,
    features: [
      "Seamless Facebook Shop order fulfillment",
      "Messenger order processing support",
      "Multi-channel inventory with Facebook and Instagram",
      "Social commerce-optimized packaging",
      "Returns management for social orders"
    ],
    bestFor: ["Consumer Goods", "Apparel", "Beauty", "Home Products"],
    integration: "Facebook Commerce API integration",
    setupTime: "2-4 business days"
  },
  "Whatnot": {
    name: "Whatnot",
    description: "Live selling and auction platform",
    fullDescription: `Whatnot is the leading live selling platform where sellers conduct real-time auctions and sales. We provide specialized fulfillment for Whatnot sellers, offering fast turnaround times essential for live selling success.

Our service ensures orders from your live shows ship quickly, maintaining buyer excitement and satisfaction while you focus on hosting great shows.`,
    features: [
      "Same-day shipping for live show orders",
      "Fast processing for maintaining buyer momentum",
      "Bulk pre-show inventory prep",
      "Order consolidation for multi-win buyers",
      "Photo documentation for high-value items"
    ],
    bestFor: ["Collectibles", "Trading Cards", "Sneakers", "Vintage Items"],
    integration: "Order import via Whatnot seller dashboard",
    setupTime: "1-2 business days"
  },
  "Pinterest Shopping": {
    name: "Pinterest Shopping",
    description: "Visual discovery and shopping platform",
    fullDescription: `Pinterest Shopping transforms inspiration into purchases through shoppable pins. We provide fulfillment services optimized for Pinterest-driven commerce, understanding that Pinterest shoppers are planners and dreamers looking for quality products.

Our service ensures every order reflects the curated, high-quality experience Pinterest users expect.`,
    features: [
      "Pinterest catalog feed integration",
      "Visual commerce-optimized fulfillment",
      "Seasonal and trend-based inventory management",
      "Premium packaging for aspirational products",
      "Gift and special occasion order handling"
    ],
    bestFor: ["Home Decor", "Fashion", "Wedding Products", "DIY Supplies"],
    integration: "Pinterest API for product catalog sync",
    setupTime: "3-4 business days"
  },
  "WooCommerce": {
    name: "WooCommerce",
    description: "WordPress e-commerce plugin for custom stores",
    fullDescription: `WooCommerce powers millions of online stores built on WordPress. We provide flexible fulfillment services that integrate seamlessly with your WooCommerce store, whether you're selling physical products, subscriptions, or digital goods with physical components.

Our WooCommerce integration ensures automatic order import, inventory sync, and tracking updates without manual intervention.`,
    features: [
      "Direct WooCommerce plugin integration",
      "Automatic order import and processing",
      "Real-time inventory synchronization",
      "Custom shipping method integration",
      "Support for subscription and recurring orders"
    ],
    bestFor: ["Custom Brands", "WordPress Sites", "Subscription Products", "Niche Markets"],
    integration: "WooCommerce REST API integration",
    setupTime: "2-3 business days"
  },
  "BigCommerce": {
    name: "BigCommerce",
    description: "Enterprise e-commerce platform",
    fullDescription: `BigCommerce is a powerful enterprise e-commerce platform designed for growing and established businesses. We provide enterprise-grade fulfillment services that match BigCommerce's capabilities, supporting high-volume operations and complex business requirements.

Our integration with BigCommerce ensures smooth operations at any scale, from startup to enterprise.`,
    features: [
      "Enterprise-level fulfillment capabilities",
      "High-volume order processing",
      "Multi-channel inventory management",
      "B2B and wholesale fulfillment support",
      "Advanced inventory forecasting and reporting"
    ],
    bestFor: ["Growing Brands", "Enterprise Businesses", "B2B Sellers", "High-Volume Stores"],
    integration: "BigCommerce API with webhook support",
    setupTime: "3-5 business days"
  },
  "Magento": {
    name: "Magento",
    description: "Flexible open-source e-commerce platform",
    fullDescription: `Magento (Adobe Commerce) is a highly customizable e-commerce platform preferred by businesses needing flexibility and control. We provide fulfillment services that integrate with Magento's extensive capabilities, supporting custom workflows and complex business logic.

Our Magento integration adapts to your custom setup, ensuring seamless fulfillment regardless of your platform customizations.`,
    features: [
      "Custom platform integration support",
      "Complex workflow compatibility",
      "Multi-store and multi-warehouse support",
      "B2B and wholesale order handling",
      "Advanced inventory rules and automation"
    ],
    bestFor: ["Custom Businesses", "Enterprise Commerce", "B2B Operations", "Complex Catalogs"],
    integration: "Magento REST API with custom endpoint support",
    setupTime: "5-7 business days for custom setup"
  },
  "Wix": {
    name: "Wix",
    description: "Website builder with integrated e-commerce",
    fullDescription: `Wix combines website building with e-commerce capabilities, making it easy for businesses to sell online without technical expertise. We provide straightforward fulfillment services that integrate with Wix stores, handling your orders while you focus on growing your business.

Perfect for small businesses and entrepreneurs, our Wix integration is simple to set up and reliable to operate.`,
    features: [
      "Simple Wix store integration",
      "Automatic order synchronization",
      "Inventory management for Wix stores",
      "Small business-friendly service",
      "Scalable as your business grows"
    ],
    bestFor: ["Small Businesses", "Startups", "Service-Based Sellers", "New E-commerce"],
    integration: "Wix eCommerce API integration",
    setupTime: "1-2 business days"
  },
  "Squarespace": {
    name: "Squarespace",
    description: "Design-focused website and commerce platform",
    fullDescription: `Squarespace is known for beautiful, design-focused websites with integrated commerce capabilities. We provide fulfillment services that complement Squarespace's aesthetic excellence, ensuring your products' presentation matches the quality of your website.

Our integration maintains the seamless experience Squarespace is known for, from your site to your customers' hands.`,
    features: [
      "Design-focused fulfillment services",
      "Premium packaging options",
      "Squarespace Commerce integration",
      "Inventory sync with Squarespace stores",
      "Brand-aligned presentation"
    ],
    bestFor: ["Design Brands", "Creative Businesses", "Lifestyle Products", "Premium Goods"],
    integration: "Squarespace Commerce API",
    setupTime: "2-3 business days"
  },
  "Faire": {
    name: "Faire",
    description: "Wholesale marketplace connecting brands and retailers",
    fullDescription: `Faire is the leading online wholesale marketplace connecting independent brands with retailers worldwide. We provide specialized B2B fulfillment for Faire sellers, handling wholesale orders, retailer shipments, and bulk distribution with the professionalism wholesale buyers expect.

From pallet building to retailer compliance, we ensure your Faire orders arrive ready for retail shelves.`,
    features: [
      "Wholesale order fulfillment",
      "Bulk packaging and pallet building",
      "Retailer compliance prep",
      "Drop shipping to retail locations",
      "Order consolidation for multi-product buyers"
    ],
    bestFor: ["Wholesale Brands", "Artisan Products", "Retail Vendors", "B2B Sellers"],
    integration: "Faire API integration for wholesale orders",
    setupTime: "3-5 business days"
  },
  "Alibaba": {
    name: "Alibaba",
    description: "Global B2B wholesale and manufacturing marketplace",
    fullDescription: `Alibaba is the world's largest B2B marketplace, connecting manufacturers and wholesalers with buyers globally. We provide fulfillment services for Alibaba sellers shipping to the U.S., handling customs clearance, quality inspection, and distribution.

Whether you're importing for your own brand or fulfilling wholesale orders, we manage the logistics so you can focus on sourcing and sales.`,
    features: [
      "Import receiving and customs coordination",
      "Quality inspection upon arrival",
      "Bulk storage and distribution",
      "Wholesale order fulfillment",
      "Repackaging and private label support"
    ],
    bestFor: ["Importers", "Wholesale Distributors", "Private Label Brands", "B2B Sellers"],
    integration: "Manual order processing with Alibaba seller accounts",
    setupTime: "5-7 business days plus customs processing"
  },
  "Mercado Libre": {
    name: "Mercado Libre",
    description: "Leading e-commerce platform in Latin America",
    fullDescription: `Mercado Libre is the largest e-commerce platform in Latin America, serving markets across Mexico, Brazil, Argentina, and more. We provide fulfillment services for U.S.-based sellers shipping to Latin American customers, handling international shipping, customs documentation, and regional compliance.

Expand your business into Latin American markets with confidence, knowing your orders will arrive safely and on time.`,
    features: [
      "International shipping to Latin America",
      "Customs documentation preparation",
      "Regional compliance support",
      "Multi-country distribution",
      "Spanish and Portuguese order handling"
    ],
    bestFor: ["International Sellers", "Latin American Markets", "Export Businesses", "Global Brands"],
    integration: "Mercado Libre API for international orders",
    setupTime: "5-7 business days for international setup"
  },
  "Rakuten": {
    name: "Rakuten",
    description: "Major Japanese e-commerce platform",
    fullDescription: `Rakuten is one of Japan's largest e-commerce platforms, offering access to millions of Japanese consumers. We provide specialized fulfillment for sellers targeting the Japanese market, including Japan-specific packaging requirements, customs compliance, and shipping coordination.

Enter the Japanese market with a fulfillment partner who understands the unique requirements and high standards of Japanese e-commerce.`,
    features: [
      "Japan-specific packaging and labeling",
      "International shipping to Japan",
      "Customs and import compliance",
      "Japanese market quality standards",
      "Return handling for international orders"
    ],
    bestFor: ["Japan Market Sellers", "International Brands", "Consumer Electronics", "Fashion"],
    integration: "Rakuten API for international fulfillment",
    setupTime: "7-10 business days for international setup"
  }
};
