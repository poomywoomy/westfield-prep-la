import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
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
    const allLocations = await shopifyGraphQLPaginated(
      store.shop_domain,
      store.access_token,
      LOCATIONS_QUERY,
      'locations'
    );
    
    const activeLocations = allLocations.filter((loc: any) => loc.isActive);
    
    if (activeLocations.length === 0) {
      throw new Error('No active location found in Shopify');
    }

    // Return all active locations for user selection
    const locations = activeLocations.map((loc: any) => ({
      id: loc.legacyResourceId || loc.id.split('/').pop(),
      gid: loc.id,
      name: loc.name,
      address: loc.address,
      isActive: loc.isActive
    }));

    // Auto-set first location if none configured
    const { data: client } = await supabase
      .from('clients')
      .select('shopify_location_id')
      .eq('id', client_id)
      .single();

    if (!client?.shopify_location_id && locations.length > 0) {
      const primaryLocation = locations[0];
      await supabase
        .from('clients')
        .update({ shopify_location_id: primaryLocation.id })
        .eq('id', client_id);

      console.log(`Auto-set Shopify location ${primaryLocation.id} for client ${client_id}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        locations,
        current_location_id: client?.shopify_location_id || locations[0]?.id
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
