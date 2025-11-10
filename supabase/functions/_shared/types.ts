// Shared type definitions and utility functions for Shopify integrations

export interface NormalizedLineItem {
  id: string;              // Numeric Shopify line item ID
  title: string;           // Product title
  quantity: number;        // Quantity ordered
  sku: string | null;      // SKU if available
  variant_id: string;      // Numeric variant ID
  product_id: string;      // Numeric product ID
  price: string;           // Unit price
}

/**
 * Normalizes a Shopify line item from various API formats (REST, GraphQL, webhook)
 * into a consistent structure for database storage
 */
export function normalizeLineItem(raw: any): NormalizedLineItem {
  // Handle GID format (gid://shopify/LineItem/123) or plain numeric
  const extractId = (val: any): string => {
    if (!val) return '';
    const str = val.toString();
    return str.includes('/') ? str.split('/').pop() || '' : str;
  };

  return {
    id: extractId(raw.id),
    title: raw.title || raw.name || '',
    quantity: raw.quantity || 0,
    sku: raw.sku || null,
    variant_id: extractId(raw.variant_id || raw.variant?.id),
    product_id: extractId(raw.product_id || raw.product?.id),
    price: raw.price || raw.variant?.price || '0',
  };
}
