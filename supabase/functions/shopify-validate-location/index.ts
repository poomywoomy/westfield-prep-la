import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { shopifyGraphQL } from '../_shared/shopify-graphql.ts';

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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { client_id, location_id } = await req.json();

    if (!client_id || !location_id) {
      throw new Error('Missing required parameters: client_id and location_id');
    }

    // Get Shopify store credentials
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .maybeSingle();

    if (!store) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'No active Shopify store found for this client' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Validate location via Shopify GraphQL
    const locationQuery = `
      query {
        location(id: "gid://shopify/Location/${location_id}") {
          id
          name
          isActive
          fulfillsOnlineOrders
        }
      }
    `;

    const result = await shopifyGraphQL(
      store.shop_domain,
      store.access_token,
      locationQuery
    );

    if (!result.location) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `Location ID ${location_id} not found in Shopify. Please check the ID and try again.` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!result.location.isActive) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `Location "${result.location.name}" exists but is inactive. Please activate it in Shopify.` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ 
        valid: true, 
        location_name: result.location.name,
        is_active: result.location.isActive,
        fulfills_online_orders: result.location.fulfillsOnlineOrders
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Location validation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(
      JSON.stringify({ valid: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
