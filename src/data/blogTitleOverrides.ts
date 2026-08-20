// Slug-specific SEO title overrides, shared by the blog route head (SSR)
// and the blog post page so both emit identical values.
export const BLOG_TITLE_OVERRIDES: Record<string, string> = {
  'why-3pl-fulfillment-is-essential-for-startups-scaling-with-amazon-fba': '3PL Fulfillment for Startups Scaling with Amazon FBA',
  '3pl-fulfillment-startups-scaling-amazon-fba': '3PL Fulfillment for Startups Scaling with Amazon FBA',
  'fulfillment-center-los-angeles-growing-ecommerce-brands': 'Fulfillment Center Los Angeles for Growing Ecommerce Brands',
  '7-ways-fulfillment-service-los-angeles-improves-delivery': '7 Ways Fulfillment Service Los Angeles Speeds Shipping',
  '8-professional-fulfillment-services-small-companies': '8 Fulfillment Services Designed for Small Business Growth',
  '9-fulfillment-service-los-angeles-ideas-work-fast': '9 Fulfillment Services Los Angeles Tips for Faster Shipping',
  'shopify-fulfillment-vs-amazon-fba-for-online-sellers': 'Shopify Fulfillment vs Amazon FBA: Which Drives Growth?',
  'ecommerce-fulfillment-los-angeles-vs-retail-logistics-hub': 'E-commerce Fulfillment Solutions vs Retail Logistics',
  'tiktok-fulfillment-center-vs-traditional-warehousing-models': 'TikTok Fulfillment vs Traditional Warehouse Systems',
  'micro-warehouses-vs-fulfillment-centers-for-small-businesses': 'Micro Warehouses vs Fulfillment Centers: Complete Guide',
  'los-angeles-fulfillment-center-vs-local-warehousing-solutions': 'Which Is Better: Fulfillment Center or Local Warehouse?',
  'warehousing-and-fulfillment-vs-order-fulfillment-services': 'Compare Logistics: Warehousing vs Order Fulfillment',
  '7-ways-ecommerce-fulfillment-center-improve-business-growth': '7 Ecommerce Fulfillment Center Benefits for Business Growth',
  'direct-to-consumer-fulfillment-vs-multi-channel-fulfillment': 'Choosing Between DTC and Multi-Channel Fulfillment Solutions',
  '3pl-for-amazon-fba-vs-ecommerce-fulfillment-centers': 'Choosing Between Amazon FBA 3PL and E-commerce Fulfillment',
  'warehouse-automation-vs-west-coast-3pl-warehouse-services': 'Warehouse Automation vs 3PL Warehouse Services Explained',
  'automated-order-fulfillment-vs-storage-for-ecommerce': 'Automated Order Fulfillment vs Ecommerce Storage Explained',
  'amazon-fba-prep-center-vs-3pl-fulfillment-which-supports-business-growth': 'Amazon FBA Prep Center vs 3PL Fulfillment for Growth',
  'why-3pl-warehousing-los-angeles-smart-business-investment': '3PL Warehousing Los Angeles Is a Smart Business Investment',
  'how-fulfillment-center-los-angeles-california-supports-business-growth': 'How Fulfillment Center Los Angeles California Boosts Growth',
  'why-los-angeles-smart-base-ecommerce-companies-3pls': 'Why Los Angeles Is Ideal for Ecommerce Companies and 3PLs',
  'how-los-angeles-fulfillment-center-helps-ecommerce-brands-ship-fast': 'LA Fulfillment Center for Ecommerce Brands | Westfield Prep',
};

export function getBlogSeoTitle(slug: string, title: string): string {
  return BLOG_TITLE_OVERRIDES[slug] ?? title.replace(/\s*\|.*$/, "");
}
