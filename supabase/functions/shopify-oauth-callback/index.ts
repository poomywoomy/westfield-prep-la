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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const shop = url.searchParams.get('shop');
    const state = url.searchParams.get('state');

    console.log('OAuth callback received - Shop:', shop, 'Code:', code ? 'present' : 'missing');

    if (!code || !shop) {
      console.error('Missing OAuth parameters - code:', !!code, 'shop:', shop);
      throw new Error('Missing required OAuth parameters');
    }

    const clientId = Deno.env.get('SHOPIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SHOPIFY_CLIENT_SECRET');
    const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-01';

    console.log('Exchanging code for access token...');

    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', tokenResponse.status, errorText);
      throw new Error('Failed to exchange OAuth code for access token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, scope } = tokenData;
    
    console.log('Access token received, scope:', scope);

    // Get auth header from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header in callback request');
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    console.log('Getting authenticated user...');

    // Get user's client_id
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }

    console.log('User authenticated:', user.id);

    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!client) {
      console.error('No client profile found for user:', user.id);
      throw new Error('Client profile not found');
    }

    console.log('Storing Shopify connection for client:', client.id);

    // Store Shopify connection
    const { error: storeError } = await supabase
      .from('shopify_stores')
      .upsert({
        client_id: client.id,
        shop_domain: shop,
        access_token,
        scope,
        is_active: true,
      }, {
        onConflict: 'shop_domain',
      });

    if (storeError) {
      console.error('Failed to store Shopify connection:', storeError);
      throw storeError;
    }

    console.log('Shopify store connected successfully!');

    // Redirect back to client dashboard
    const redirectUrl = `${url.origin}/client-dashboard?shopify_connected=true`;
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl,
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    
    // Redirect to error page
    const url = new URL(req.url);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorUrl = `${url.origin}/client-dashboard?shopify_error=${encodeURIComponent(errorMessage)}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': errorUrl,
      },
    });
  }
});
