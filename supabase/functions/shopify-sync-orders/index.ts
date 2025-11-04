import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { client_id } = await req.json();

    // Get client info
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('id', client_id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    // Get store credentials
    const { data: store } = await supabase
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
    let nextPageUrl: string | null = `https://${store.shop_domain}/admin/api/2024-01/orders.json?limit=250&status=any`;
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

    // Process and upsert orders
    const ordersData = allOrders.map((order: any) => ({
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
      shopify_created_at: order.created_at,
    }));

    const { error: upsertError } = await supabase
      .from('shopify_orders')
      .upsert(ordersData, { onConflict: 'client_id,shopify_order_id' });

    if (upsertError) {
      throw upsertError;
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
