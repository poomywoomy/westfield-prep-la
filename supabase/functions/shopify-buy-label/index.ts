import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { shopifyGraphQL } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FULFILLMENT_MUTATION = `
  mutation fulfillmentCreateV2($fulfillment: FulfillmentV2Input!) {
    fulfillmentCreateV2(fulfillment: $fulfillment) {
      fulfillment {
        id
        status
        trackingInfo {
          number
          company
          url
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { 
      client_id, 
      order_id, 
      selected_rate, 
      tracking_number, 
      notify_customer = true 
    } = await req.json();

    if (!client_id || !order_id) {
      throw new Error('Missing required fields: client_id, order_id');
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get order
    const { data: order, error: orderError } = await serviceClient
      .from('shopify_orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Get Shopify store credentials
    const { data: store, error: storeError } = await serviceClient
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .single();

    if (storeError || !store) {
      throw new Error('No active Shopify store found');
    }

    // Get fulfillment order ID
    let fulfillmentOrderId = order.fulfillment_order_id;

    if (!fulfillmentOrderId) {
      // Fetch it from Shopify
      const FULFILLMENT_ORDERS_QUERY = `
        query getFulfillmentOrders($orderId: ID!) {
          order(id: $orderId) {
            fulfillmentOrders(first: 10) {
              edges {
                node {
                  id
                  status
                }
              }
            }
          }
        }
      `;

      const data = await shopifyGraphQL(
        store.shop_domain,
        store.access_token,
        FULFILLMENT_ORDERS_QUERY,
        { orderId: `gid://shopify/Order/${order.shopify_order_id}` }
      );

      const fulfillmentOrder = data.order.fulfillmentOrders.edges.find(
        (edge: any) => edge.node.status === 'OPEN' || edge.node.status === 'IN_PROGRESS'
      );

      if (!fulfillmentOrder) {
        throw new Error('No open fulfillment order found');
      }

      fulfillmentOrderId = fulfillmentOrder.node.id;
    }

    // Create fulfillment in Shopify (client pays for shipping directly)
    const result = await shopifyGraphQL(
      store.shop_domain,
      store.access_token,
      FULFILLMENT_MUTATION,
      {
        fulfillment: {
          lineItemsByFulfillmentOrder: [{
            fulfillmentOrderId: fulfillmentOrderId
          }],
          trackingInfo: {
            company: selected_rate?.carrier || 'Custom',
            number: tracking_number,
          },
          notifyCustomer: notify_customer
        }
      }
    );

    if (result.fulfillmentCreateV2.userErrors?.length > 0) {
      throw new Error(result.fulfillmentCreateV2.userErrors.map((e: any) => e.message).join(', '));
    }

    const fulfillment = result.fulfillmentCreateV2.fulfillment;

    // Log the fulfillment
    await serviceClient.from('audit_log').insert({
      user_id: user.id,
      action: 'SHOPIFY_LABEL_PURCHASED',
      table_name: 'shopify_orders',
      record_id: order_id,
      new_data: { 
        tracking_number: fulfillment.trackingInfo?.number,
        carrier: fulfillment.trackingInfo?.company,
        label_url: fulfillment.trackingInfo?.url,
      },
    });

    console.log(`Label purchased for order ${order.shopify_order_id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        tracking_number: fulfillment.trackingInfo?.number,
        carrier: fulfillment.trackingInfo?.company,
        label_url: fulfillment.trackingInfo?.url,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error purchasing label:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unable to purchase label. Please try again.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
