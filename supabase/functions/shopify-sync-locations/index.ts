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

    const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-01';

    // Fetch locations from Shopify
    const locationsResponse = await fetch(
      `https://${store.shop_domain}/admin/api/${apiVersion}/locations.json`,
      {
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!locationsResponse.ok) {
      throw new Error('Failed to fetch locations from Shopify');
    }

    const { locations } = await locationsResponse.json();
    
    // Get primary location (first active location)
    const primaryLocation = locations.find((loc: any) => loc.active) || locations[0];
    
    if (!primaryLocation) {
      throw new Error('No active location found in Shopify');
    }

    // Store location ID in clients table
    const { error: updateError } = await supabase
      .from('clients')
      .update({ shopify_location_id: primaryLocation.id.toString() })
      .eq('id', client_id);

    if (updateError) throw updateError;

    console.log(`Stored Shopify location ${primaryLocation.id} for client ${client_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        location: {
          id: primaryLocation.id,
          name: primaryLocation.name,
          address: primaryLocation.address1,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Location sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to sync locations' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});