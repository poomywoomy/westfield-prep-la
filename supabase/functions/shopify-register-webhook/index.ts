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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userRole || userRole.role !== 'admin') {
      throw new Error('Unauthorized - admin access required');
    }

    const { client_id, topic } = await req.json();

    if (!client_id || !topic) {
      throw new Error('Missing required fields: client_id and topic');
    }

    // Get the Shopify store for this client
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .single();

    if (storeError || !store) {
      throw new Error('No active Shopify store found for this client');
    }

    const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-01';
    const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-webhook-handler`;

    // Register webhook with Shopify
    const shopifyResponse = await fetch(
      `https://${store.shop_domain}/admin/api/${apiVersion}/webhooks.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': store.access_token,
        },
        body: JSON.stringify({
          webhook: {
            topic,
            address: callbackUrl,
            format: 'json',
          },
        }),
      }
    );

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      console.error('Shopify webhook registration failed:', errorText);
      throw new Error(`Failed to register webhook with Shopify: ${errorText}`);
    }

    const shopifyData = await shopifyResponse.json();
    const webhook = shopifyData.webhook;

    // Store webhook in database
    const { error: insertError } = await supabase
      .from('shopify_webhooks')
      .insert({
        client_id,
        webhook_id: webhook.id.toString(),
        topic,
        address: callbackUrl,
        is_active: true,
      });

    if (insertError) {
      console.error('Failed to store webhook in database:', insertError);
      throw insertError;
    }

    // Log the action
    await supabase.from('audit_log').insert({
      user_id: user.id,
      action: 'SHOPIFY_WEBHOOK_REGISTERED',
      table_name: 'shopify_webhooks',
      record_id: client_id,
      new_data: { topic, webhook_id: webhook.id },
    });

    console.log(`Webhook registered successfully: ${topic} for client ${client_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        webhook_id: webhook.id,
        topic,
        address: callbackUrl,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error registering webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
