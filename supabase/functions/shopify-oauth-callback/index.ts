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

    console.log('OAuth callback received - Shop:', shop, 'State:', state ? 'present' : 'missing');

    if (!code || !shop || !state) {
      console.error('Missing OAuth parameters');
      throw new Error('Missing required OAuth parameters');
    }

    // Validate state parameter to prevent session hijacking
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: stateRecord, error: stateError } = await supabase
      .from('oauth_states')
      .select('user_id, expires_at, frontend_origin')
      .eq('state', state)
      .single();

    if (stateError || !stateRecord) {
      console.error('Invalid or missing state:', stateError);
      throw new Error('Invalid OAuth state');
    }

    // Check if state has expired
    if (new Date() > new Date(stateRecord.expires_at)) {
      console.error('Expired OAuth state');
      // Clean up expired state
      await supabase.from('oauth_states').delete().eq('state', state);
      throw new Error('OAuth state expired');
    }

    const userId = stateRecord.user_id;

    // Clean up used state
    await supabase.from('oauth_states').delete().eq('state', state);

    console.log('State validated for user:', userId);

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

    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!client) {
      console.error('No client profile found for user:', userId);
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

    // Register mandatory compliance webhooks
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-webhook-handler`;
    const mandatoryTopics = [
      'customers/data_request',
      'customers/redact',
      'shop/redact'
    ];

    for (const topic of mandatoryTopics) {
      try {
        const webhookResponse = await fetch(
          `https://${shop}/admin/api/${apiVersion}/webhooks.json`,
          {
            method: 'POST',
            headers: {
              'X-Shopify-Access-Token': access_token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              webhook: {
                topic,
                address: webhookUrl,
                format: 'json',
              },
            }),
          }
        );

        if (webhookResponse.ok) {
          const webhookData = await webhookResponse.json();
          console.log(`Registered mandatory webhook: ${topic}`);
          
          // Store webhook registration
          await supabase.from('shopify_webhooks').insert({
            client_id: client.id,
            webhook_id: webhookData.webhook.id.toString(),
            topic,
            address: webhookUrl,
            is_active: true,
          });
        } else {
          console.error(`Failed to register webhook ${topic}:`, await webhookResponse.text());
        }
      } catch (error) {
        console.error(`Error registering webhook ${topic}:`, error);
        // Continue with other webhooks even if one fails
      }
    }

    // Redirect back to client dashboard using stored frontend origin
    const frontendOrigin = stateRecord.frontend_origin || url.origin;
    const redirectUrl = `${frontendOrigin}/client/dashboard?shopify_connected=true`;
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl,
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    
    // Redirect to error page with generic message
    const url = new URL(req.url);
    const referer = req.headers.get('Referer') || '';
    const frontendOrigin = referer ? new URL(referer).origin : url.origin;
    const errorUrl = `${frontendOrigin}/client/dashboard?shopify_error=${encodeURIComponent('Failed to connect Shopify store. Please try again.')}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': errorUrl,
      },
    });
  }
});
