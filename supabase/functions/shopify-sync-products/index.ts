import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas for Shopify data
const shopifyVariantSchema = z.object({
  id: z.union([z.string(), z.number()]),
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
  let nextPageUrl = `https://${shopDomain}/admin/api/${apiVersion}/products.json?limit=250`;
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

    // Get user's Shopify store
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!client) {
      throw new Error('Client profile not found');
    }

    const { data: shopifyStore } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .single();

    if (!shopifyStore) {
      throw new Error('No active Shopify store connected');
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

    // Sync products to skus table (correct table name)
    const skusToInsert = validatedProducts.flatMap((product) => 
      product.variants.map((variant) => ({
        client_id: client.id,
        client_sku: variant.sku || `SHOP-${product.id}-${variant.id}`,
        title: `${product.title}${variant.title !== 'Default Title' ? ` - ${variant.title}` : ''}`,
        unit_cost: variant.price,
        notes: `Shopify Product ID: ${product.id}, Variant ID: ${variant.id}`,
        status: 'active',
      }))
    );

    // Upsert SKUs with correct conflict key
    const { error: skuError } = await supabase
      .from('skus')
      .upsert(skusToInsert, {
        onConflict: 'client_id,client_sku',
      });

    if (skuError) {
      throw skuError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: skusToInsert.length,
        message: `Successfully synced ${skusToInsert.length} products from Shopify` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Product sync error:', error);
    
    let errorMessage = 'Unable to sync products from Shopify. Please try again or contact support.';
    
    if (error.message?.includes('authentication') || error.message?.includes('401')) {
      errorMessage = 'Shopify authentication failed. Please reconnect your store.';
    } else if (error.message?.includes('429')) {
      errorMessage = 'Shopify API rate limit reached. Please try again in a few minutes.';
    } else if (error.message?.includes('402')) {
      errorMessage = 'Shopify store is frozen or suspended.';
    } else if (error.message?.includes('does not exist')) {
      errorMessage = 'Database error. Please contact support.';
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
