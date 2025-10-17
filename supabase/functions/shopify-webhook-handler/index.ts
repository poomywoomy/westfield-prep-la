import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { createHmac, timingSafeEqual } from 'node:crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-shop-domain, x-shopify-topic, x-shopify-webhook-id',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const shopifySecret = Deno.env.get('SHOPIFY_CLIENT_SECRET')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get webhook headers
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const shopDomain = req.headers.get('x-shopify-shop-domain');
    const topic = req.headers.get('x-shopify-topic');
    const webhookId = req.headers.get('x-shopify-webhook-id');

    if (!hmac || !shopDomain || !topic || !webhookId) {
      throw new Error('Missing required webhook headers');
    }

    // Check for replay attacks - verify webhook hasn't been processed before
    const { data: existingWebhook } = await supabase
      .from('processed_webhooks')
      .select('id')
      .eq('webhook_id', webhookId)
      .single();

    if (existingWebhook) {
      console.log('Webhook already processed:', webhookId);
      return new Response(
        JSON.stringify({ success: true, message: 'Webhook already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Read and verify webhook payload with timing-safe comparison
    const body = await req.text();
    const generatedHmac = createHmac('sha256', shopifySecret)
      .update(body)
      .digest();

    // Decode received HMAC from base64
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const hmacDecoded = Uint8Array.from(atob(hmac), c => c.charCodeAt(0));

    // Use timing-safe comparison
    if (generatedHmac.length !== hmacDecoded.length || !timingSafeEqual(generatedHmac, hmacDecoded)) {
      console.error('HMAC verification failed');
      throw new Error('Invalid webhook signature');
    }

    const payload = JSON.parse(body);
    console.log(`Received webhook: ${topic} from ${shopDomain}`);

    // Get client_id from shop domain
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('client_id, id')
      .eq('shop_domain', shopDomain)
      .eq('is_active', true)
      .single();

    if (!store) {
      throw new Error('Store not found');
    }

    // Mark webhook as processed to prevent replay attacks
    await supabase
      .from('processed_webhooks')
      .insert({
        webhook_id: webhookId,
        shop_domain: shopDomain,
        topic
      });

    // Log webhook delivery
    const { data: logEntry } = await supabase
      .from('webhook_delivery_logs')
      .insert({
        webhook_id: webhookId,
        shop_domain: shopDomain,
        topic,
        payload,
        status: 'pending',
      })
      .select()
      .single();

    try {
      // Handle different webhook topics
      if (topic.startsWith('products/')) {
        await handleProductWebhook(supabase, store.client_id, topic, payload);
      } else if (topic === 'inventory_levels/update') {
        await handleInventoryWebhook(supabase, store.client_id, payload);
      } else if (topic.startsWith('orders/')) {
        await handleOrderWebhook(supabase, store.client_id, topic, payload);
      }

      // Update log as successful
      if (logEntry) {
        await supabase
          .from('webhook_delivery_logs')
          .update({
            status: 'success',
            response_code: 200,
          })
          .eq('id', logEntry.id);
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (error) {
      // Update log with error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (logEntry) {
        await supabase
          .from('webhook_delivery_logs')
          .update({
            status: 'failed',
            error_message: errorMessage,
            response_code: 500,
          })
          .eq('id', logEntry.id);
      }
      throw error;
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    // Return generic error message to prevent information leakage
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function handleProductWebhook(
  supabase: any,
  clientId: string,
  topic: string,
  product: any
) {
  console.log(`Handling ${topic} for product ${product.id}`);

  if (topic === 'products/delete') {
    // Delete all variants of this product
    await supabase
      .from('client_skus')
      .delete()
      .eq('client_id', clientId)
      .like('sku', `${product.id}-%`);
    return;
  }

  // Upsert product variants
  const productData = product.variants.map((variant: any) => ({
    client_id: clientId,
    sku: variant.sku || `${product.id}-${variant.id}`,
    product_name: variant.title !== 'Default Title' 
      ? `${product.title} - ${variant.title}`
      : product.title,
    default_unit_price: parseFloat(variant.price) || 0,
  }));

  await supabase
    .from('client_skus')
    .upsert(productData, { onConflict: 'client_id,sku' });
}

async function handleInventoryWebhook(
  supabase: any,
  clientId: string,
  payload: any
) {
  console.log(`Updating inventory for item ${payload.inventory_item_id}`);

  // Update inventory_sync table
  await supabase
    .from('inventory_sync')
    .upsert({
      client_id: clientId,
      sku: payload.inventory_item_id.toString(),
      shopify_quantity: payload.available || 0,
      last_synced_at: new Date().toISOString(),
    }, { onConflict: 'client_id,sku' });
}

async function handleOrderWebhook(
  supabase: any,
  clientId: string,
  topic: string,
  order: any
) {
  console.log(`Handling ${topic} for order ${order.id}`);

  const orderData = {
    client_id: clientId,
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
  };

  await supabase
    .from('shopify_orders')
    .upsert(orderData, { onConflict: 'client_id,shopify_order_id' });
}
