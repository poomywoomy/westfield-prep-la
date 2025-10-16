import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Sync products to client_skus table
    const skusToInsert = products.flatMap((product: any) => 
      product.variants.map((variant: any) => ({
        client_id: client.id,
        sku: variant.sku || `${product.id}-${variant.id}`,
        product_name: `${product.title}${variant.title !== 'Default Title' ? ` - ${variant.title}` : ''}`,
        default_unit_price: parseFloat(variant.price) || 0,
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
