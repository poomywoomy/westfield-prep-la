import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { shopifyGraphQL } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map REST topic names to GraphQL enum values
const TOPIC_MAP: Record<string, string> = {
  'products/create': 'PRODUCTS_CREATE',
  'products/update': 'PRODUCTS_UPDATE',
  'products/delete': 'PRODUCTS_DELETE',
  'orders/create': 'ORDERS_CREATE',
  'orders/fulfilled': 'ORDERS_FULFILLED',
  'orders/cancelled': 'ORDERS_CANCELLED',
  'inventory_levels/update': 'INVENTORY_LEVELS_UPDATE',
  'returns/request': 'RETURNS_REQUEST',
  'returns/approve': 'RETURNS_APPROVE',
  'returns/decline': 'RETURNS_DECLINE',
  'fulfillment_orders/order_routing_complete': 'FULFILLMENT_ORDERS_ORDER_ROUTING_COMPLETE',
  'customers/data_request': 'CUSTOMERS_DATA_REQUEST',
  'customers/redact': 'CUSTOMERS_REDACT',
  'shop/redact': 'SHOP_REDACT',
};

const WEBHOOK_SUBSCRIPTION_CREATE = `
  mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $callbackUrl: URL!) {
    webhookSubscriptionCreate(
      topic: $topic
      webhookSubscription: { format: JSON, callbackUrl: $callbackUrl }
    ) {
      webhookSubscription {
        id
        topic
        endpoint {
          __typename
          ... on WebhookHttpEndpoint {
            callbackUrl
          }
        }
      }
      userErrors {
        field
        message
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

    const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-webhook-handler`;
    
    // Convert topic to GraphQL enum format
    const graphqlTopic = TOPIC_MAP[topic] || topic.toUpperCase().replace(/\//g, '_');

    // Register webhook using GraphQL
    const data = await shopifyGraphQL(
      store.shop_domain,
      store.access_token,
      WEBHOOK_SUBSCRIPTION_CREATE,
      { topic: graphqlTopic, callbackUrl }
    );

    if (data.webhookSubscriptionCreate.userErrors?.length > 0) {
      const errors = data.webhookSubscriptionCreate.userErrors.map((e: any) => e.message).join(', ');
      throw new Error(`Shopify webhook errors: ${errors}`);
    }

    const webhook = data.webhookSubscriptionCreate.webhookSubscription;
    const webhookId = webhook.id.split('/').pop(); // Extract numeric ID from gid

    // Store webhook in database
    const { error: insertError } = await supabase
      .from('shopify_webhooks')
      .insert({
        client_id,
        webhook_id: webhookId,
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
      new_data: { topic, webhook_id: webhookId },
    });

    console.log(`Webhook registered successfully: ${topic} for client ${client_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        webhook_id: webhookId,
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
