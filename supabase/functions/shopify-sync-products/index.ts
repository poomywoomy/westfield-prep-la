import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

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

function parseLinkHeader(header: string | null): string | null {
  if (!header) return null;
  const nextMatch = header.match(/<([^>]+)>;\s*rel="next"/);
  return nextMatch ? nextMatch[1] : null;
}

async function fetchAllProducts(shopDomain: string, accessToken: string, apiVersion: string) {
  const allProducts = [];
  let nextPageUrl: string | null = `https://${shopDomain}/admin/api/${apiVersion}/products.json?limit=250`;
  let pageCount = 0;
  
  while (nextPageUrl) {
    pageCount++;
    console.log(`Fetching products page ${pageCount}...`);
    
    const response = await fetch(nextPageUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch products: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    allProducts.push(...data.products);
    
    // Get next page from Link header
    const linkHeader = response.headers.get('Link');
    nextPageUrl = parseLinkHeader(linkHeader);
    
    // Add small delay to respect rate limits (2 req/sec for REST Admin API)
    if (nextPageUrl) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`Fetched ${allProducts.length} total products from ${pageCount} pages`);
  return allProducts;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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

    const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-01';

    // Fetch all products with pagination
    const products = await fetchAllProducts(
      shopifyStore.shop_domain,
      shopifyStore.access_token,
      apiVersion
    );

    // Validate Shopify product data
    const productsValidation = z.array(shopifyProductSchema).safeParse(products);
    
    if (!productsValidation.success) {
      console.error('Invalid Shopify product data:', productsValidation.error);
      throw new Error('Invalid product data structure received from Shopify');
    }

    const validatedProducts = productsValidation.data;

    // Sync products to skus table using service client
    const skusToInsert = validatedProducts.flatMap((product) => 
      product.variants.map((variant) => ({
        client_id: targetClientId,
        client_sku: variant.sku || `SHOP-${product.id}-${variant.id}`,
        title: `${product.title}${variant.title !== 'Default Title' ? ` - ${variant.title}` : ''}`,
        unit_cost: variant.price,
        notes: `Shopify Product ID: ${product.id}, Variant ID: ${variant.id}, Inventory Item ID: ${variant.inventory_item_id}`,
        status: 'active',
      }))
    );

    // Upsert SKUs using service client
    const { error: skuError } = await serviceClient
      .from('skus')
      .upsert(skusToInsert, {
        onConflict: 'client_id,client_sku',
      });

    if (skuError) {
      throw skuError;
    }

    // Seed inventory from Shopify for new SKUs
    // Get primary location
    const { data: primaryLocation } = await serviceClient
      .from('locations')
      .select('id')
      .eq('code', 'MAIN')
      .single();

    let seededCount = 0;
    const seedErrors = [];

    if (primaryLocation) {
      for (const product of validatedProducts) {
        for (const variant of product.variants) {
          const clientSku = variant.sku || `SHOP-${product.id}-${variant.id}`;
          
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
              // Fetch Shopify inventory level using inventory_item_id
              try {
                const inventoryItemId = variant.inventory_item_id.toString();
                const inventoryResponse = await fetch(
                  `https://${shopifyStore.shop_domain}/admin/api/${apiVersion}/inventory_levels.json?inventory_item_ids=${inventoryItemId}`,
                  {
                    headers: {
                      'X-Shopify-Access-Token': shopifyStore.access_token,
                    }
                  }
                );

                if (inventoryResponse.ok) {
                  const { inventory_levels } = await inventoryResponse.json();
                  const availableQty = inventory_levels?.reduce((sum: number, level: any) => sum + (level.available || 0), 0) || 0;

                  if (availableQty > 0) {
                    // Create initial ledger entry
                    const { error: seedError } = await serviceClient
                      .from('inventory_ledger')
                      .insert({
                        client_id: targetClientId,
                        sku_id: existingSku.id,
                        location_id: primaryLocation.id,
                        qty_delta: availableQty,
                        transaction_type: 'adjustment',
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: skusToInsert.length,
        seeded: seededCount,
        message: `Successfully synced ${skusToInsert.length} products from Shopify${seededCount > 0 ? ` and seeded ${seededCount} inventory records` : ''}`,
        seedErrors: seedErrors.length > 0 ? seedErrors : undefined
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Product sync error:', error);
    
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
