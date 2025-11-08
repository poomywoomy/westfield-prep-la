import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { shopifyGraphQLPaginated } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let syncLogId: string | null = null;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Create service client for RLS-free database operations
    const serviceClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { client_id } = await req.json();

    // Start sync log
    const { data: syncLog } = await serviceClient
      .from('sync_logs')
      .insert({
        client_id: client_id,
        sync_type: 'orders',
        status: 'in_progress',
        products_synced: 0,
        triggered_by: user.id,
      })
      .select()
      .single();

    if (syncLog) {
      syncLogId = syncLog.id;
    }

    // Get client info using service client
    const { data: client } = await serviceClient
      .from('clients')
      .select('id')
      .eq('id', client_id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    // Get store credentials using service client
    const { data: store } = await serviceClient
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .single();

    if (!store) {
      throw new Error('Store not found or inactive');
    }

    // Fetch all orders via GraphQL
    console.log('Fetching orders via GraphQL...');
    
    const query = `
      query getOrders($cursor: String) {
        orders(first: 250, after: $cursor, query: "status:any") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              name
              email
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              displayFulfillmentStatus
              displayFinancialStatus
              customer {
                displayName
              }
              shippingAddress {
                name
                address1
                address2
                city
                provinceCode
                zip
                countryCodeV2
              }
              lineItems(first: 100) {
                edges {
                  node {
                    id
                    title
                    quantity
                    sku
                    variant {
                      id
                    }
                  }
                }
              }
              createdAt
            }
          }
        }
      }
    `;

    const rawOrders = await shopifyGraphQLPaginated(
      store.shop_domain,
      store.access_token,
      query,
      'orders'
    );

    // Transform GraphQL response to REST format
    const allOrders = rawOrders.map((order: any) => ({
      id: order.id.split('/').pop(),
      name: order.name,
      email: order.email,
      total_price: order.totalPriceSet.shopMoney.amount,
      currency: order.totalPriceSet.shopMoney.currencyCode,
      fulfillment_status: order.displayFulfillmentStatus?.toLowerCase() || null,
      financial_status: order.displayFinancialStatus?.toLowerCase() || null,
      customer: order.customer ? { name: order.customer.displayName } : null,
      shipping_address: order.shippingAddress ? {
        name: order.shippingAddress.name,
        address1: order.shippingAddress.address1,
        address2: order.shippingAddress.address2,
        city: order.shippingAddress.city,
        province_code: order.shippingAddress.provinceCode,
        zip: order.shippingAddress.zip,
        country_code: order.shippingAddress.countryCodeV2,
      } : null,
      line_items: order.lineItems.edges.map((li: any) => ({
        id: li.node.id.split('/').pop(),
        title: li.node.title,
        quantity: li.node.quantity,
        sku: li.node.sku,
        variant_id: li.node.variant?.id.split('/').pop(),
      })),
      created_at: order.createdAt,
    }));
    
    console.log(`Fetched ${allOrders.length} total orders via GraphQL`);

    // Process and upsert orders using service client
    const ordersData = allOrders.map((order: any) => {
      // Get first fulfillment order ID if available
      const fulfillmentOrderId = order.fulfillment_orders?.[0]?.id?.toString() || null;
      
      return {
        client_id,
        shopify_order_id: order.id.toString(),
        order_number: order.name,
        customer_email: order.email,
        customer_name: order.customer?.name || order.shipping_address?.name,
        total_price: parseFloat(order.total_price),
        currency: order.currency,
        fulfillment_status: order.fulfillment_status,
        financial_status: order.financial_status,
        line_items: order.line_items,
        shipping_address: order.shipping_address,
        created_at_shopify: order.created_at,
        fulfillment_order_id: fulfillmentOrderId,
      };
    });

    const { error: upsertError } = await serviceClient
      .from('shopify_orders')
      .upsert(ordersData, { onConflict: 'client_id,shopify_order_id' });

    if (upsertError) {
      throw upsertError;
    }

    const durationMs = Date.now() - startTime;

    // Update sync log to success
    if (syncLogId) {
      await serviceClient
        .from('sync_logs')
        .update({
          status: 'success',
          products_synced: ordersData.length,
          duration_ms: durationMs,
        })
        .eq('id', syncLogId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orders_synced: ordersData.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Order sync error:', error);
    
    const durationMs = Date.now() - startTime;

    // Update sync log to failed
    if (syncLogId) {
      const serviceClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      await serviceClient
        .from('sync_logs')
        .update({
          status: 'failed',
          duration_ms: durationMs,
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', syncLogId);
    }
    
    let errorMessage = 'Unable to sync orders from Shopify. Please try again or contact support.';
    
    if (error instanceof Error) {
      if (error.message?.includes('authentication') || error.message?.includes('401')) {
        errorMessage = 'Shopify authentication failed. Please reconnect your store.';
      } else if (error.message?.includes('429')) {
        errorMessage = 'Shopify API rate limit reached. Please try again in a few minutes.';
      } else if (error.message?.includes('402')) {
        errorMessage = 'Shopify store is frozen or suspended.';
      }
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
