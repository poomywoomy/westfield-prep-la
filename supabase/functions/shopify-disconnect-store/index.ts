import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { shopifyGraphQL, shopifyGraphQLPaginated } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WEBHOOK_SUBSCRIPTIONS_QUERY = `
  query ($cursor: String) {
    webhookSubscriptions(first: 100, after: $cursor) {
      edges {
        node {
          id
          endpoint {
            __typename
            ... on WebhookHttpEndpoint {
              callbackUrl
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const WEBHOOK_SUBSCRIPTION_DELETE = `
  mutation webhookSubscriptionDelete($id: ID!) {
    webhookSubscriptionDelete(id: $id) {
      deletedWebhookSubscriptionId
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Verify user is authenticated and is admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify admin role
    const { data: role } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!role || role.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { client_id, delete_products = false } = await req.json();

    if (!client_id) {
      throw new Error('client_id is required');
    }

    // Get store info before disconnecting
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('client_id', client_id)
      .single();

    if (!store) {
      throw new Error('Store not found');
    }

    // Deactivate the store
    await supabase
      .from('shopify_stores')
      .update({ is_active: false })
      .eq('client_id', client_id);

    // Disable auto-sync
    await supabase
      .from('shopify_sync_config')
      .update({ auto_sync_enabled: false })
      .eq('client_id', client_id);

    // Delete webhooks from Shopify using GraphQL
    try {
      const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-webhook-handler`;
      
      // Fetch all webhook subscriptions
      const allWebhooks = await shopifyGraphQLPaginated(
        store.shop_domain,
        store.access_token,
        WEBHOOK_SUBSCRIPTIONS_QUERY,
        'webhookSubscriptions'
      );

      // Filter for our webhooks (matching callback URL)
      const ourWebhooks = allWebhooks.filter((webhook: any) => 
        webhook.endpoint?.callbackUrl === webhookUrl
      );

      // Delete each webhook
      for (const webhook of ourWebhooks) {
        try {
          const data = await shopifyGraphQL(
            store.shop_domain,
            store.access_token,
            WEBHOOK_SUBSCRIPTION_DELETE,
            { id: webhook.id }
          );

          if (data.webhookSubscriptionDelete.userErrors?.length > 0) {
            console.error('Error deleting webhook:', data.webhookSubscriptionDelete.userErrors);
          } else {
            console.log('Deleted webhook:', webhook.id);
          }
        } catch (error) {
          console.error('Error deleting webhook:', error);
        }
      }

      // Delete webhook records from database
      await supabase
        .from('shopify_webhooks')
        .delete()
        .eq('client_id', client_id);
    } catch (error) {
      console.error('Error deleting webhooks:', error);
      // Continue even if webhook deletion fails
    }

    // Optionally delete synced products
    if (delete_products) {
      await supabase
        .from('skus')
        .delete()
        .eq('client_id', client_id);
    }

    // Log the action
    await supabase.from('audit_log').insert({
      user_id: user.id,
      action: 'DISCONNECT_STORE',
      table_name: 'shopify_stores',
      record_id: client_id,
      old_data: store,
      new_data: { delete_products },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Store disconnected successfully',
        products_deleted: delete_products,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Disconnect store error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Unable to disconnect Shopify store. Please try again or contact support.' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
