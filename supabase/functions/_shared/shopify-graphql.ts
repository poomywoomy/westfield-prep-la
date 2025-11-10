export async function shopifyGraphQL(
  shopDomain: string,
  accessToken: string,
  query: string,
  variables?: any,
  retries = 3
) {
  const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-10';
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
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

      // PHASE 5 FIX: Parse rate limit headers for proactive throttling
      const callLimitHeader = response.headers.get('X-Shopify-Shop-Api-Call-Limit');
      if (callLimitHeader) {
        const [current, max] = callLimitHeader.split('/').map(Number);
        const usage = (current / max) * 100;
        
        if (usage > 85) {
          const jitter = Math.random() * 1000;
          const backoffMs = 2000 + jitter;
          console.log(`⚠️  Rate limit approaching (${current}/${max} = ${usage.toFixed(1)}%), throttling ${backoffMs.toFixed(0)}ms`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        } else if (usage > 70) {
          console.log(`⚠️  Rate limit usage: ${current}/${max} (${usage.toFixed(1)}%)`);
        }
      }

      // Handle rate limiting (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '5';
        const waitMs = parseInt(retryAfter) * 1000;
        console.log(`⚠️  Rate limited, waiting ${waitMs}ms (attempt ${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }

      // Handle server errors (5xx) - retry
      if (response.status >= 500) {
        if (attempt < retries) {
          const waitMs = 2000 * attempt;
          console.log(`⚠️  Server error ${response.status}, retrying in ${waitMs}ms (${attempt}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, waitMs));
          continue;
        }
      }

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        const errorMsg = JSON.stringify(result.errors);
        throw new Error(`GraphQL errors: ${errorMsg}\nQuery: ${query.substring(0, 100)}...`);
      }
      
      return result.data;
    } catch (error) {
      if (attempt === retries) {
        console.error(`❌ All ${retries} attempts failed for GraphQL request`);
        throw error;
      }
      console.error(`⚠️  Attempt ${attempt} failed:`, error);
    }
  }
  
  throw new Error('GraphQL request exhausted all retries');
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
