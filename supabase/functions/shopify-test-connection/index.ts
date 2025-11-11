import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { shopifyGraphQL } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOP_QUERY = `
  query {
    shop {
      name
      myshopifyDomain
      email
      plan {
        displayName
      }
    }
  }
`;

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

    // Test connection using GraphQL
    const data = await shopifyGraphQL(
      store.shop_domain,
      store.access_token,
      SHOP_QUERY
    );

    const shop = data.shop;

    // PHASE 6 P4: Validate required scopes
    const scopeQuery = `
      query {
        app {
          installation {
            accessScopes {
              handle
            }
          }
        }
      }
    `;

    const scopeData = await shopifyGraphQL(store.shop_domain, store.access_token, scopeQuery);

    const requiredScopes = [
      'read_products',
      'write_products',
      'read_orders',
      'write_orders',
      'read_inventory',
      'write_inventory',
      'read_fulfillments',
      'write_fulfillments',
      'read_locations',
    ];

    const grantedScopes = scopeData.app?.installation?.accessScopes?.map((s: any) => s.handle) || [];
    const missingScopes = requiredScopes.filter(scope => !grantedScopes.includes(scope));

    if (missingScopes.length > 0) {
      console.warn(`⚠️  Missing scopes: ${missingScopes.join(', ')}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required permissions: ${missingScopes.join(', ')}. Please reinstall the Shopify app.`,
          missing_scopes: missingScopes,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    console.log('✓ All required scopes present');

    // Check if location is configured
    const { data: clientConfig } = await supabase
      .from('clients')
      .select('shopify_location_id')
      .eq('id', client_id)
      .single();

    const locationConfigured = !!clientConfig?.shopify_location_id;

    console.log(`Location configured: ${locationConfigured}, ID: ${clientConfig?.shopify_location_id || 'N/A'}`);

    // Log the test in audit_log
    await supabase.from('audit_log').insert({
      user_id: user.id,
      action: 'TEST_CONNECTION',
      table_name: 'shopify_stores',
      record_id: client_id,
      new_data: { shop_name: shop.name, test_successful: true, location_configured: locationConfigured },
    });

    return new Response(
      JSON.stringify({
        success: true,
        shop_name: shop.name,
        shop_domain: shop.myshopifyDomain,
        email: shop.email,
        plan: shop.plan?.displayName,
        location_configured: locationConfigured,
        location_id: clientConfig?.shopify_location_id || null,
        warning: !locationConfigured ? 'Location not configured. Run location sync before inventory sync.' : null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Test connection error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Unable to test Shopify connection. Please try again or contact support.' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
