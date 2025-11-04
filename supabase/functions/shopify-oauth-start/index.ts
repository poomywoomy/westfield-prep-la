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

    // Get authenticated user for state validation
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Failed to authenticate user:', userError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clientId = Deno.env.get('SHOPIFY_CLIENT_ID');
    const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-01';
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-oauth-callback`;
    
    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);
    
    const scopes = 'read_products,write_products,read_orders,write_orders,read_inventory,write_inventory,read_customers,write_customers,read_fulfillments,write_fulfillments';
    
    // Generate secure state parameter and store it
    const state = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    const { error: stateError } = await supabase
      .from('oauth_states')
      .insert({
        state,
        user_id: user.id,
        expires_at: expiresAt.toISOString()
      });
    
    if (stateError) {
      console.error('Failed to store OAuth state:', stateError);
      return new Response(
        JSON.stringify({ error: 'Failed to initialize OAuth flow' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&grant_options[]=per-user`;
    
    console.log('Generated OAuth URL with state:', state);

    return new Response(
      JSON.stringify({ authUrl, state }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error starting OAuth:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to start OAuth flow' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
