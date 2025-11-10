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
      } else if (topic === 'fulfillment_orders/order_routing_complete') {
        await handleFulfillmentOrderWebhook(supabase, store.client_id, payload);
      } else if (topic.startsWith('returns/')) {
        await handleReturnWebhook(supabase, store.client_id, topic, payload);
      } else if (topic.startsWith('customers/') || topic.startsWith('shop/')) {
        // Handle mandatory compliance webhooks
        await handleComplianceWebhook(supabase, shopDomain, topic, payload);
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
    // Delete all variants of this product from skus table
    await supabase
      .from('skus')
      .delete()
      .eq('client_id', clientId)
      .like('client_sku', `SHOP-${product.id}-%`);
    return;
  }

  // Upsert product variants to skus table
  const productData = product.variants.map((variant: any) => ({
    client_id: clientId,
    client_sku: variant.sku || `SHOP-${product.id}-${variant.id}`,
    title: variant.title !== 'Default Title' 
      ? `${product.title} - ${variant.title}`
      : product.title,
    unit_cost: parseFloat(variant.price) || 0,
    notes: `Shopify Product ID: ${product.id}, Variant ID: ${variant.id}`,
    status: 'active',
  }));

  await supabase
    .from('skus')
    .upsert(productData, { onConflict: 'client_id,client_sku' });
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

  // CRITICAL: Auto-decrement inventory when order is created/paid
  // This keeps app inventory in sync with Shopify's automatic decrements
  if (topic === 'orders/create' || topic === 'orders/paid') {
    await decrementInventoryForOrder(supabase, clientId, order);
  }
}

async function decrementInventoryForOrder(
  supabase: any,
  clientId: string,
  order: any
) {
  console.log(`Attempting to decrement inventory for order ${order.id}`);
  
  // Check if we've already processed this order's inventory
  const { data: existingEntries } = await supabase
    .from('inventory_ledger')
    .select('id')
    .eq('source_type', 'shopify_order')
    .eq('source_id', order.id.toString())
    .limit(1);

  if (existingEntries && existingEntries.length > 0) {
    console.log(`Inventory already decremented for order ${order.id}`);
    return;
  }

  // Get main location for this client
  let { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('client_id', clientId)
    .eq('code', 'MAIN')
    .maybeSingle();

  // Auto-create if missing
  if (!location) {
    console.log(`Creating MAIN location for client ${clientId}`);
    const { data: newLocation, error: createError } = await supabase
      .from('locations')
      .insert({
        client_id: clientId,
        code: 'MAIN',
        name: 'Main Warehouse',
        is_active: true
      })
      .select()
      .single();
    
    if (createError) {
      console.error(`Failed to create location for client ${clientId}:`, createError);
      return;
    }
    location = newLocation;
  }

  // Process each line item
  const ledgerEntries = [];
  
  for (const lineItem of order.line_items) {
    if (!lineItem.variant_id) {
      console.warn(`No variant_id for line item in order ${order.id}`);
      continue;
    }

    // Strategy 1: Look up by shopify_variant_id alias
    let sku_id = null;
    const { data: alias } = await supabase
      .from('sku_aliases')
      .select('sku_id')
      .eq('alias_type', 'shopify_variant_id')
      .eq('alias_value', lineItem.variant_id.toString())
      .maybeSingle();

    if (alias) {
      sku_id = alias.sku_id;
    } else {
      // Strategy 2: Direct SKU match
      const { data: skuByClientSku } = await supabase
        .from('skus')
        .select('id')
        .eq('client_id', clientId)
        .eq('client_sku', lineItem.sku)
        .maybeSingle();
      
      if (skuByClientSku) {
        sku_id = skuByClientSku.id;
      } else {
        // Strategy 3: Fallback internal SKU pattern
        const fallbackSku = `SHOP-${lineItem.product_id}-${lineItem.variant_id}`;
        const { data: skuByFallback } = await supabase
          .from('skus')
          .select('id')
          .eq('client_id', clientId)
          .eq('client_sku', fallbackSku)
          .maybeSingle();
        
        if (skuByFallback) {
          sku_id = skuByFallback.id;
        }
      }
    }

    if (!sku_id) {
      console.warn(`No SKU mapping found for variant ${lineItem.variant_id} using any strategy in order ${order.id}`);
      continue;
    }

    // Create ledger entry to decrement inventory
    ledgerEntries.push({
      client_id: clientId,
      sku_id: sku_id,
      location_id: location.id,
      qty_delta: -lineItem.quantity, // Negative = decrement
      transaction_type: 'SALE_DECREMENT',
      source_type: 'shopify_order',
      source_id: order.id.toString(),
      notes: `Shopify order ${order.name} - ${lineItem.title}`,
      user_id: null, // System-generated
    });
  }

  if (ledgerEntries.length > 0) {
    const { error } = await supabase
      .from('inventory_ledger')
      .insert(ledgerEntries);

    if (error) {
      console.error('Failed to create ledger entries for order:', error);
      throw error;
    }

    console.log(`✓ Decremented inventory for ${ledgerEntries.length} items in order ${order.id}`);
  } else {
    console.log(`No SKU mappings found for order ${order.id}, skipping inventory decrement`);
  }
}

async function handleComplianceWebhook(
  supabase: any,
  shopDomain: string,
  topic: string,
  payload: any
) {
  console.log(`Handling compliance webhook: ${topic} for ${shopDomain}`);

  // Map topic to webhook_type
  let webhookType: string;
  if (topic === 'customers/data_request') {
    webhookType = 'data_request';
  } else if (topic === 'customers/redact') {
    webhookType = 'customer_redact';
  } else if (topic === 'shop/redact') {
    webhookType = 'shop_redact';
  } else {
    throw new Error(`Unknown compliance webhook topic: ${topic}`);
  }

  // Log the compliance webhook for admin review
  await supabase
    .from('compliance_webhooks')
    .insert({
      webhook_type: webhookType,
      shop_domain: shopDomain,
      payload,
      processed: false,
    });

  console.log(`Compliance webhook logged: ${webhookType} for ${shopDomain}`);
}

async function handleFulfillmentOrderWebhook(
  supabase: any,
  clientId: string,
  payload: any
) {
  console.log(`Handling fulfillment order routing for client ${clientId}`);
  
  const fulfillmentOrder = payload.fulfillment_order;
  
  // Update order record with fulfillment_order_id
  const { error } = await supabase
    .from('shopify_orders')
    .update({ fulfillment_order_id: fulfillmentOrder.id.toString() })
    .eq('shopify_order_id', fulfillmentOrder.order_id.toString())
    .eq('client_id', clientId);
  
  if (error) {
    console.error('Failed to update fulfillment order ID:', error);
  } else {
    console.log(`Updated order ${fulfillmentOrder.order_id} with fulfillment order ID ${fulfillmentOrder.id}`);
  }
}

async function handleReturnWebhook(
  supabase: any,
  clientId: string,
  topic: string,
  payload: any
) {
  console.log(`Handling return webhook: ${topic} for client ${clientId}`);
  
  const returnRequest = payload.return;
  
  // Log return event for admin/client review
  console.log(`Return ${returnRequest.id} - Status: ${returnRequest.status}`);
  
  // Could create notification or activity log entry here
  // For now, just log it for reference
}
