/**
 * Safety guard for Shopify REST API calls
 * Prevents deprecated products/variants endpoints from being called
 * All new code should use GraphQL; this is only for legacy endpoints that lack GraphQL support
 */
export async function guardedShopifyREST(
  shopDomain: string,
  accessToken: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-10';
  
  // Block deprecated product/variant endpoints
  const deprecatedPatterns = [
    '/products.json',
    '/products/',
    '/variants.json',
    '/variants/',
    '/admin/products',
    '/admin/variants',
  ];
  
  const lowerEndpoint = endpoint.toLowerCase();
  for (const pattern of deprecatedPatterns) {
    if (lowerEndpoint.includes(pattern)) {
      console.error(`BLOCKED: Attempt to call deprecated REST endpoint: ${endpoint}`);
      throw new Error(`Deprecated REST endpoint blocked: ${pattern}. Use GraphQL instead.`);
    }
  }
  
  // Log REST API usage for monitoring
  console.log(`[REST API] ${options.method || 'GET'} ${endpoint} (API version: ${apiVersion})`);
  
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `https://${shopDomain}/admin/api/${apiVersion}${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
