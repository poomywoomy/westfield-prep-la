import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { shopifyGraphQLPaginated, shopifyGraphQL } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas for Shopify data
const shopifyVariantSchema = z.object({
  id: z.union([z.string(), z.number()]),
  inventory_item_id: z.union([z.string(), z.number()]),
  sku: z.string().max(100).optional().nullable(),
  title: z.string().max(200),
  price: z.union([z.string(), z.number()]).transform(val => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) || !isFinite(num) ? 0 : num;
  }),
});

const shopifyProductSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string().max(200),
  variants: z.array(shopifyVariantSchema).min(1),
});

async function fetchAllProducts(shopDomain: string, accessToken: string) {
  console.log('Fetching products via GraphQL...');
  
  const query = `
    query getProducts($cursor: String) {
      products(first: 250, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            variants(first: 100) {
              edges {
                node {
                  id
                  sku
                  title
                  price
                  inventoryItem {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const rawProducts = await shopifyGraphQLPaginated(
    shopDomain,
    accessToken,
    query,
    'products'
  );

  // Transform GraphQL response to match REST format
  const products = rawProducts.map((product: any) => ({
    id: product.id.split('/').pop(),
    title: product.title,
    variants: product.variants.edges.map((v: any) => ({
      id: v.node.id.split('/').pop(),
      inventory_item_id: v.node.inventoryItem.id.split('/').pop(),
      sku: v.node.sku,
      title: v.node.title,
      price: v.node.price,
    })),
  }));

  console.log(`Fetched ${products.length} total products via GraphQL`);
  return products;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let syncLogId: string | null = null;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Create service client for RLS-free database operations
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Parse request body to get client_id
    const body = await req.json().catch(() => null);
    const requestedClientId = body?.client_id;

    // Check if user is admin
    const { data: userRole } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isAdmin = userRole?.role === 'admin';

    // Determine target client
    let targetClientId: string;
    if (isAdmin && requestedClientId) {
      targetClientId = requestedClientId;
    } else {
      const { data: client } = await serviceClient
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) {
        return new Response(
          JSON.stringify({ error: 'Client profile not found' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      targetClientId = client.id;
    }

    // Start sync log
    const { data: syncLog } = await serviceClient
      .from('sync_logs')
      .insert({
        client_id: targetClientId,
        sync_type: 'products',
        status: 'in_progress',
        products_synced: 0,
        triggered_by: user.id,
      })
      .select()
      .single();

    if (syncLog) {
      syncLogId = syncLog.id;
    }

    const { data: shopifyStore } = await serviceClient
      .from('shopify_stores')
      .select('*')
      .eq('client_id', targetClientId)
      .eq('is_active', true)
      .single();

    if (!shopifyStore) {
      return new Response(
        JSON.stringify({ error: 'No active Shopify store connected for this client' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all products with GraphQL
    const products = await fetchAllProducts(
      shopifyStore.shop_domain,
      shopifyStore.access_token
    );

    // Validate Shopify product data
    const productsValidation = z.array(shopifyProductSchema).safeParse(products);
    
    if (!productsValidation.success) {
      console.error('Invalid Shopify product data:', productsValidation.error);
      throw new Error('Invalid product data structure received from Shopify');
    }

    const validatedProducts = productsValidation.data;

    // Get existing SKUs to determine inserts vs updates
    const { data: existingSkus } = await serviceClient
      .from('skus')
      .select('client_sku, internal_sku')
      .eq('client_id', targetClientId);

    const existingSkuMap = new Map(existingSkus?.map(s => [s.client_sku, s.internal_sku]) || []);

    // Build SKU records with proper internal_sku fallback
    const skusToUpsert = [];

    for (const product of validatedProducts) {
      for (const variant of product.variants) {
        // Generate fallback internal_sku for SKU-less variants
        const fallbackInternalSku = `SHOP-${String(product.id).trim()}-${String(variant.id).trim()}`;
        const rawSku = (variant.sku ?? '').trim();
        const internalSku = rawSku.length > 0 ? rawSku : fallbackInternalSku;
        const clientSku = internalSku;
        
        // Defensive logging for empty internal_sku (should never happen)
        if (!internalSku) {
          console.error(`Empty internal_sku for product ${product.id}, variant ${variant.id}, title: ${variant.title}`);
          continue;
        }

        const title = `${product.title}${variant.title !== 'Default Title' ? ` - ${variant.title}` : ''}`;
        
        skusToUpsert.push({
          client_id: targetClientId,
          client_sku: clientSku,
          internal_sku: existingSkuMap.get(clientSku) ?? internalSku, // Use existing or fallback
          title,
          unit_cost: variant.price,
          notes: `Shopify Product ID: ${product.id}, Variant ID: ${variant.id}, Inventory Item ID: ${variant.inventory_item_id}`,
          status: 'active' as const,
        });
      }
    }

    // Upsert all SKUs with internal_sku always present
    if (skusToUpsert.length > 0) {
      const { error: upsertError } = await serviceClient
        .from('skus')
        .upsert(skusToUpsert, {
          onConflict: 'client_id,client_sku',
          ignoreDuplicates: false,
        });
      if (upsertError) throw upsertError;
    }

    const totalSynced = skusToUpsert.length;

    // After upserting SKUs, map inventory_item_id to sku_id via sku_aliases
    const aliasesToInsert = [];
    for (const product of validatedProducts) {
      for (const variant of product.variants) {
        const fallbackInternalSku = `SHOP-${String(product.id).trim()}-${String(variant.id).trim()}`;
        const rawSku = (variant.sku ?? '').trim();
        const clientSku = rawSku.length > 0 ? rawSku : fallbackInternalSku;
        
        // Find the sku_id
        const { data: skuRecord } = await serviceClient
          .from('skus')
          .select('id')
          .eq('client_id', targetClientId)
          .eq('client_sku', clientSku)
          .single();

        if (skuRecord) {
          aliasesToInsert.push({
            sku_id: skuRecord.id,
            alias_type: 'shopify_inventory_item_id',
            alias_value: variant.inventory_item_id.toString(),
          });
          aliasesToInsert.push({
            sku_id: skuRecord.id,
            alias_type: 'shopify_variant_id',
            alias_value: variant.id.toString(),
          });
        }
      }
    }

    // Upsert aliases
    if (aliasesToInsert.length > 0) {
      const { error: aliasError } = await serviceClient
        .from('sku_aliases')
        .upsert(aliasesToInsert, {
          onConflict: 'sku_id,alias_type,alias_value',
        });

      if (aliasError) {
        console.error('Error upserting sku_aliases:', aliasError);
      }
    }

    // Seed inventory from Shopify for new SKUs
    // Get or create primary location
    let { data: primaryLocation } = await serviceClient
      .from('locations')
      .select('id')
      .eq('code', 'MAIN')
      .single();
    
    if (!primaryLocation) {
      // Create MAIN location if it doesn't exist
      const { data: newLocation, error: locationError } = await serviceClient
        .from('locations')
        .insert({
          code: 'MAIN',
          name: 'Main Warehouse',
          is_active: true
        })
        .select()
        .single();
      
      if (locationError) {
        console.error('Error creating MAIN location:', locationError);
      } else {
        primaryLocation = newLocation;
      }
    }

    let seededCount = 0;
    const seedErrors = [];

    if (primaryLocation) {
      for (const product of validatedProducts) {
        for (const variant of product.variants) {
          const fallbackInternalSku = `SHOP-${String(product.id).trim()}-${String(variant.id).trim()}`;
          const rawSku = (variant.sku ?? '').trim();
          const clientSku = rawSku.length > 0 ? rawSku : fallbackInternalSku;
          
          // Check if SKU has existing inventory
          const { data: existingSku } = await serviceClient
            .from('skus')
            .select('id')
            .eq('client_id', targetClientId)
            .eq('client_sku', clientSku)
            .single();

          if (existingSku) {
            const { count: ledgerCount } = await serviceClient
              .from('inventory_ledger')
              .select('id', { count: 'exact', head: true })
              .eq('sku_id', existingSku.id);

            // Only seed if no existing ledger entries
            if (ledgerCount === 0) {
              // Fetch Shopify inventory level via GraphQL
              try {
                const inventoryItemId = variant.inventory_item_id.toString();
                
                const inventoryQuery = `
                  query getInventoryItem($id: ID!) {
                    inventoryItem(id: $id) {
                      id
                      inventoryLevels(first: 10) {
                        edges {
                          node {
                            id
                            quantities(names: "available") {
                              name
                              quantity
                            }
                          }
                        }
                      }
                    }
                  }
                `;

                const inventoryData = await shopifyGraphQL(
                  shopifyStore.shop_domain,
                  shopifyStore.access_token,
                  inventoryQuery,
                  { id: `gid://shopify/InventoryItem/${inventoryItemId}` }
                );

                const inventoryLevels = inventoryData.inventoryItem?.inventoryLevels?.edges || [];
                const availableQty = inventoryLevels.reduce((sum: number, edge: any) => {
                  const availableQuantity = edge.node.quantities?.find((q: any) => q.name === 'available');
                  return sum + (availableQuantity?.quantity || 0);
                }, 0);

                if (availableQty > 0) {
                  // Create initial ledger entry
                  const { error: seedError } = await serviceClient
                    .from('inventory_ledger')
                    .insert({
                      client_id: targetClientId,
                      sku_id: existingSku.id,
                      location_id: primaryLocation.id,
                      qty_delta: availableQty,
                      transaction_type: 'ADJUSTMENT_PLUS',
                      reason_code: 'shopify_seed',
                      notes: `Initial inventory seeded from Shopify (${availableQty} units)`,
                      source_type: 'shopify_sync',
                    });
                  
                  if (!seedError) {
                    seededCount++;
                  } else {
                    seedErrors.push({ sku: clientSku, error: seedError.message });
                  }
                }
              } catch (invError) {
                console.error(`Failed to seed inventory for SKU ${clientSku}:`, invError);
                seedErrors.push({ sku: clientSku, error: invError instanceof Error ? invError.message : 'Unknown error' });
              }
            }
          }
        }
      }
    }

    const durationMs = Date.now() - startTime;

    // Update sync log to success
    if (syncLogId) {
      await serviceClient
        .from('sync_logs')
        .update({
          status: 'success',
          products_synced: totalSynced,
          duration_ms: durationMs,
          error_message: seedErrors.length > 0 ? JSON.stringify(seedErrors) : null,
        })
        .eq('id', syncLogId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: totalSynced,
        seeded: seededCount,
        message: `Successfully synced ${totalSynced} products from Shopify${seededCount > 0 ? ` and seeded ${seededCount} inventory records` : ''}`,
        seedErrors: seedErrors.length > 0 ? seedErrors : undefined
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Product sync error:', error);
    
    const durationMs = Date.now() - startTime;

    // Update sync log to failed
    if (syncLogId) {
      const serviceClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      await serviceClient
        .from('sync_logs')
        .update({
          status: 'failed',
          duration_ms: durationMs,
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', syncLogId);
    }
    
    let errorMessage = 'Unable to sync products from Shopify. Please try again or contact support.';
    
    if (error instanceof Error) {
      if (error.message?.includes('authentication') || error.message?.includes('401')) {
        errorMessage = 'Shopify authentication failed. Please reconnect your store.';
      } else if (error.message?.includes('429')) {
        errorMessage = 'Shopify API rate limit reached. Please try again in a few minutes.';
      } else if (error.message?.includes('402')) {
        errorMessage = 'Shopify store is frozen or suspended.';
      } else if (error.message?.includes('does not exist')) {
        errorMessage = 'Database error. Please contact support.';
      }
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
