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
    const { shop } = await req.json();

    console.log('Starting OAuth flow for shop:', shop);

    if (!shop) {
      console.error('No shop domain provided');
      return new Response(
        JSON.stringify({ error: 'Shop domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clientId = Deno.env.get('SHOPIFY_CLIENT_ID');
    const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-01';
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-oauth-callback`;
    
    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);
    
    const scopes = 'read_products,write_products,read_orders,write_orders,read_inventory,write_inventory';
    const nonce = crypto.randomUUID();

    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${nonce}`;
    
    console.log('Generated OAuth URL:', authUrl);

    return new Response(
      JSON.stringify({ authUrl, nonce }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error starting OAuth:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
