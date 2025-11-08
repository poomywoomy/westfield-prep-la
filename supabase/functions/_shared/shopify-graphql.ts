export async function shopifyGraphQL(
  shopDomain: string,
  accessToken: string,
  query: string,
  variables?: any
) {
  const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-10';
  const response = await fetch(
    `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }
  
  return result.data;
}

// Helper for paginated queries
export async function shopifyGraphQLPaginated(
  shopDomain: string,
  accessToken: string,
  query: string,
  nodeKey: string,
  variables?: any
) {
  const allItems = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const data = await shopifyGraphQL(
      shopDomain,
      accessToken,
      query,
      { ...variables, cursor }
    );
    
    const connection = data[nodeKey];
    allItems.push(...connection.edges.map((edge: any) => edge.node));
    
    hasNextPage = connection.pageInfo.hasNextPage;
    cursor = connection.pageInfo.endCursor;
    
    // Rate limiting
    if (hasNextPage) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return allItems;
}
