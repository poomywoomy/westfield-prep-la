import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { shopifyGraphQLPaginated } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOCATIONS_QUERY = `
  query ($cursor: String) {
    locations(first: 100, after: $cursor) {
      edges {
        node {
          id
          name
          isActive
          address {
            address1
            city
            province
            zip
            country
          }
          legacyResourceId
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { client_id } = await req.json();

    // Get store credentials
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .single();

    if (!store) throw new Error('Store not found');

    // Fetch locations using GraphQL
    const locations = await shopifyGraphQLPaginated(
      store.shop_domain,
      store.access_token,
      LOCATIONS_QUERY,
      'locations'
    );
    
    // Get primary location (first active location)
    const primaryLocation = locations.find((loc: any) => loc.isActive) || locations[0];
    
    if (!primaryLocation) {
      throw new Error('No active location found in Shopify');
    }

    // Use legacyResourceId for compatibility with existing code
    const locationId = primaryLocation.legacyResourceId || primaryLocation.id.split('/').pop();

    // Store location ID in clients table
    const { error: updateError } = await supabase
      .from('clients')
      .update({ shopify_location_id: locationId.toString() })
      .eq('id', client_id);

    if (updateError) throw updateError;

    console.log(`Stored Shopify location ${locationId} for client ${client_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        location: {
          id: locationId,
          name: primaryLocation.name,
          address: primaryLocation.address?.address1,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Location sync error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to sync locations' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
