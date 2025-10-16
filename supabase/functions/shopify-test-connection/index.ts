import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Verify user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { client_id } = await req.json();

    if (!client_id) {
      throw new Error('client_id is required');
    }

    // Verify user has access to this client (admin or owns the client)
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('id', client_id)
      .single();

    if (!client) {
      throw new Error('Client not found or access denied');
    }

    // Get store credentials
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .single();

    if (storeError || !store) {
      throw new Error('Store not found or inactive');
    }

    // Test connection by fetching shop info
    const shopifyResponse = await fetch(
      `https://${store.shop_domain}/admin/api/2024-01/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      throw new Error(`Shopify API error: ${shopifyResponse.status} - ${errorText}`);
    }

    const { shop } = await shopifyResponse.json();

    // Log the test in audit_log
    await supabase.from('audit_log').insert({
      user_id: user.id,
      action: 'TEST_CONNECTION',
      table_name: 'shopify_stores',
      record_id: client_id,
      new_data: { shop_name: shop.name, test_successful: true },
    });

    return new Response(
      JSON.stringify({
        success: true,
        shop_name: shop.name,
        shop_domain: shop.domain,
        email: shop.email,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Test connection error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
