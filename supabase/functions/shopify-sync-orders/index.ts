import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

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

    // Fetch all orders with pagination
    const allOrders = [];
    let nextPageUrl: string | null = `https://${store.shop_domain}/admin/api/2024-07/orders.json?limit=250&status=any`;
    let pageCount = 0;
    
    while (nextPageUrl) {
      pageCount++;
      console.log(`Fetching orders page ${pageCount}...`);
      
      const shopifyResponse: Response = await fetch(nextPageUrl, {
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
      });

      if (!shopifyResponse.ok) {
        throw new Error(`Shopify API error: ${shopifyResponse.statusText}`);
      }

      const { orders } = await shopifyResponse.json();
      allOrders.push(...orders);
      
      // Get next page from Link header
      const linkHeader: string | null = shopifyResponse.headers.get('Link');
      const nextMatch: RegExpMatchArray | null = linkHeader?.match(/<([^>]+)>;\s*rel="next"/) || null;
      nextPageUrl = nextMatch ? nextMatch[1] : null;
      
      // Add delay to respect rate limits
      if (nextPageUrl) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`Fetched ${allOrders.length} total orders from ${pageCount} pages`);

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
