import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { shopifyGraphQL } from '../_shared/shopify-graphql.ts';

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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { order_id, tracking_number, carrier, notify_customer = true } = await req.json();

    if (!order_id || !tracking_number || !carrier) {
      throw new Error('Missing required fields: order_id, tracking_number, carrier');
    }

    // Get the order and client info
    const { data: order, error: orderError } = await supabase
      .from('shopify_orders')
      .select('*, clients!inner(id, user_id)')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Verify the user owns this client's order or is admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isAdmin = userRole?.role === 'admin';
    const isOwner = order.clients.user_id === user.id;

    if (!isAdmin && !isOwner) {
      throw new Error('Unauthorized to fulfill this order');
    }

    // Get Shopify store credentials
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', order.client_id)
      .eq('is_active', true)
      .single();

    if (storeError || !store) {
      throw new Error('No active Shopify store found');
    }

    // Step 1: Get fulfillment order ID via GraphQL
    console.log('Fetching fulfillment orders via GraphQL...');
    
    const fulfillmentOrderQuery = `
      query getFulfillmentOrders($orderId: ID!) {
        order(id: $orderId) {
          id
          fulfillmentOrders(first: 10) {
            edges {
              node {
                id
                status
                lineItems(first: 100) {
                  edges {
                    node {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const orderGid = `gid://shopify/Order/${order.shopify_order_id}`;
    const orderData = await shopifyGraphQL(
      store.shop_domain,
      store.access_token,
      fulfillmentOrderQuery,
      { orderId: orderGid }
    );

    const fulfillmentOrder = orderData.order.fulfillmentOrders.edges.find(
      (edge: any) => edge.node.status === 'OPEN' || edge.node.status === 'IN_PROGRESS'
    )?.node;

    if (!fulfillmentOrder) {
      throw new Error('No open fulfillment order found');
    }

    // Step 2: Create fulfillment via GraphQL mutation
    console.log('Creating fulfillment via GraphQL...');
    
    const fulfillmentMutation = `
      mutation fulfillmentCreateV2($fulfillment: FulfillmentV2Input!) {
        fulfillmentCreateV2(fulfillment: $fulfillment) {
          fulfillment {
            id
            status
            trackingInfo {
              number
              company
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const mutationResult = await shopifyGraphQL(
      store.shop_domain,
      store.access_token,
      fulfillmentMutation,
      {
        fulfillment: {
          lineItemsByFulfillmentOrder: [
            {
              fulfillmentOrderId: fulfillmentOrder.id,
            }
          ],
          trackingInfo: {
            number: tracking_number,
            company: carrier,
          },
          notifyCustomer: notify_customer,
        }
      }
    );

    if (mutationResult.fulfillmentCreateV2?.userErrors?.length > 0) {
      const errors = mutationResult.fulfillmentCreateV2.userErrors;
      throw new Error(`Fulfillment failed: ${JSON.stringify(errors)}`);
    }

    const fulfillmentData = mutationResult.fulfillmentCreateV2.fulfillment;

    // Update local order record
    const { error: updateError } = await supabase
      .from('shopify_orders')
      .update({
        fulfillment_status: 'fulfilled',
        updated_at_shopify: new Date().toISOString(),
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('Failed to update local order:', updateError);
    }

    // Log the fulfillment
    await supabase.from('audit_log').insert({
      user_id: user.id,
      action: 'SHOPIFY_ORDER_FULFILLED',
      table_name: 'shopify_orders',
      record_id: order_id,
      new_data: { 
        tracking_number, 
        carrier,
        fulfillment_id: fulfillmentData.fulfillment?.id,
      },
    });

    console.log(`Order ${order.shopify_order_id} fulfilled successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        fulfillment_id: fulfillmentData.id,
        tracking_number,
        carrier,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error fulfilling order:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Unable to fulfill order in Shopify. Please try again or contact support.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
