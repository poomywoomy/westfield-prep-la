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

    // Fetch products from Shopify
    const productsResponse = await fetch(
      `https://${shopifyStore.shop_domain}/admin/api/${apiVersion}/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyStore.access_token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!productsResponse.ok) {
      throw new Error('Failed to fetch products from Shopify');
    }

    const { products } = await productsResponse.json();

    // Validate Shopify product data
    const productsValidation = z.array(shopifyProductSchema).safeParse(products);
    
    if (!productsValidation.success) {
      console.error('Invalid Shopify product data:', productsValidation.error);
      throw new Error('Invalid product data structure received from Shopify');
    }

    const validatedProducts = productsValidation.data;

    // Sync products to client_skus table
    const skusToInsert = validatedProducts.flatMap((product) => 
      product.variants.map((variant) => ({
        client_id: client.id,
        sku: variant.sku || `${product.id}-${variant.id}`,
        product_name: `${product.title}${variant.title !== 'Default Title' ? ` - ${variant.title}` : ''}`,
        default_unit_price: variant.price,
        notes: `Shopify Product ID: ${product.id}, Variant ID: ${variant.id}`,
      }))
    );

    // Upsert SKUs
    const { error: skuError } = await supabase
      .from('client_skus')
      .upsert(skusToInsert, {
        onConflict: 'client_id,sku',
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
    return new Response(
      JSON.stringify({ 
        error: 'Unable to sync products from Shopify. Please try again or contact support.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
