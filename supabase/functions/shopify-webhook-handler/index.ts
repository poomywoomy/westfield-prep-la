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

    console.log(`[Webhook] Received: ${topic} from ${shopDomain} (ID: ${webhookId})`);

    // Read body ONCE for HMAC verification
    const body = await req.text();

    // PHASE 1 FIX: Verify HMAC BEFORE checking processed_webhooks (prevent poisoning attacks)
    const generatedHmac = createHmac('sha256', shopifySecret)
      .update(body)
      .digest();

    const hmacDecoded = Uint8Array.from(atob(hmac), c => c.charCodeAt(0));

    if (generatedHmac.length !== hmacDecoded.length || !timingSafeEqual(generatedHmac, hmacDecoded)) {
      console.error('[Webhook] HMAC verification failed');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('[Webhook] ✓ HMAC verified');

    // NOW check for replay attacks (after HMAC is verified)
    const { data: existingWebhook } = await supabase
      .from('processed_webhooks')
      .select('id')
      .eq('webhook_id', webhookId)
      .maybeSingle();

    if (existingWebhook) {
      console.log(`[Webhook] Already processed: ${webhookId}`);
      return new Response(
        JSON.stringify({ success: true, message: 'Webhook already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const payload = JSON.parse(body);

    // Get client_id from shop domain
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('client_id, id')
      .eq('shop_domain', shopDomain)
      .eq('is_active', true)
      .maybeSingle();

    if (!store) {
      throw new Error('Store not found');
    }

    // Log webhook delivery (before processing)
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

    // Mark as processed using UPSERT to handle race conditions gracefully
    await supabase
      .from('processed_webhooks')
      .upsert({
        webhook_id: webhookId,
        shop_domain: shopDomain,
        topic
      }, { onConflict: 'webhook_id', ignoreDuplicates: true });

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

      // Delete from processed_webhooks to allow retry on transient failures
      await supabase
        .from('processed_webhooks')
        .delete()
        .eq('webhook_id', webhookId);

      throw error;
    }
  } catch (error) {
    console.error('[Webhook] Fatal error:', error);
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
  console.log(`[Product] Handling ${topic} for product ${product.id}`);

  if (topic === 'products/delete') {
    await supabase
      .from('skus')
      .delete()
      .eq('client_id', clientId)
      .like('client_sku', `SHOP-${product.id}-%`);
    return;
  }

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
  console.log(`[Inventory] Updating for item ${payload.inventory_item_id}`);

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
  console.log(`[Order] Handling ${topic} for order ${order.id}`);

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

  // Auto-decrement inventory when order is created/paid
  if (topic === 'orders/create' || topic === 'orders/paid') {
    await decrementInventoryForOrder(supabase, clientId, order);
  }
}

async function decrementInventoryForOrder(
  supabase: any,
  clientId: string,
  order: any
) {
  const shopifyOrderId = order.id.toString();
  console.log(`[Inventory] Decrementing for order ${shopifyOrderId}`);
  
  // PHASE 1 FIX: Proper idempotency check using shopify_order_id
  const { data: existingEntries } = await supabase
    .from('inventory_ledger')
    .select('id')
    .eq('client_id', clientId)
    .eq('shopify_order_id', shopifyOrderId)
    .eq('transaction_type', 'SALE_DECREMENT')
    .limit(1)
    .maybeSingle();

  if (existingEntries) {
    console.log(`[Inventory] Order ${shopifyOrderId} already processed, skipping`);
    return;
  }

  // Get main location for this client
  let { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('client_id', clientId)
    .eq('code', 'MAIN')
    .maybeSingle();

  if (!location) {
    console.log(`[Inventory] Creating MAIN location for client ${clientId}`);
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
      console.error(`[Inventory] Failed to create location:`, createError);
      return;
    }
    location = newLocation;
  }

  const ledgerEntries = [];
  
  for (const lineItem of order.line_items) {
    if (!lineItem.variant_id) {
      console.warn(`[Inventory] No variant_id for line item in order ${shopifyOrderId}`);
      continue;
    }

    const variantId = lineItem.variant_id.toString();
    const clientSku = lineItem.sku;

    // PHASE 1 FIX: Enhanced SKU matching with detailed logging
    let sku_id = null;
    let matchStrategy = 'none';

    // Strategy 1: variant_id alias (most reliable)
    const { data: alias } = await supabase
      .from('sku_aliases')
      .select('sku_id, skus!inner(client_id)')
      .eq('alias_type', 'shopify_variant_id')
      .eq('alias_value', variantId)
      .eq('skus.client_id', clientId)
      .maybeSingle();

    if (alias) {
      sku_id = alias.sku_id;
      matchStrategy = 'variant_id_alias';
      console.log(`[Inventory] ✓ Strategy 1 (variant_id alias): SKU ${sku_id} for variant ${variantId}`);
    } else {
      console.log(`[Inventory] ✗ Strategy 1: No alias for variant_id ${variantId}`);
      
      // Strategy 2: Direct client_sku match
      if (clientSku) {
        const { data: skuByClientSku } = await supabase
          .from('skus')
          .select('id')
          .eq('client_id', clientId)
          .eq('client_sku', clientSku)
          .maybeSingle();
        
        if (skuByClientSku) {
          sku_id = skuByClientSku.id;
          matchStrategy = 'direct_sku_match';
          console.log(`[Inventory] ✓ Strategy 2 (direct match): SKU ${sku_id} for client_sku ${clientSku}`);
        } else {
          console.log(`[Inventory] ✗ Strategy 2: No SKU with client_sku ${clientSku}`);
        }
      }

      // Strategy 3: Fallback pattern SHOP-{product_id}-{variant_id}
      if (!sku_id) {
        const fallbackSku = `SHOP-${lineItem.product_id}-${variantId}`;
        const { data: skuByFallback } = await supabase
          .from('skus')
          .select('id')
          .eq('client_id', clientId)
          .eq('client_sku', fallbackSku)
          .maybeSingle();
        
        if (skuByFallback) {
          sku_id = skuByFallback.id;
          matchStrategy = 'fallback_pattern';
          console.log(`[Inventory] ✓ Strategy 3 (fallback): SKU ${sku_id} for ${fallbackSku}`);
        } else {
          console.log(`[Inventory] ✗ Strategy 3: No fallback SKU ${fallbackSku}`);
        }
      }
    }

    if (!sku_id) {
      console.warn(`[Inventory] ✗ No SKU mapping found for variant ${variantId}, client_sku ${clientSku}`);
      continue;
    }

    // PHASE 1 FIX: Include shopify_order_id for proper idempotency tracking
    ledgerEntries.push({
      client_id: clientId,
      sku_id: sku_id,
      location_id: location.id,
      qty_delta: -lineItem.quantity,
      transaction_type: 'SALE_DECREMENT',
      source_type: 'webhook',
      source_ref: null,
      shopify_order_id: shopifyOrderId,
      shopify_fulfillment_id: null,
      notes: `Shopify order ${order.name} via webhook (${matchStrategy})`,
      user_id: null,
    });
  }

  if (ledgerEntries.length > 0) {
    const { error } = await supabase
      .from('inventory_ledger')
      .insert(ledgerEntries);

    if (error) {
      console.error('[Inventory] Failed to create ledger entries:', error);
      throw error;
    }

    console.log(`[Inventory] ✓ Decremented ${ledgerEntries.length} items for order ${shopifyOrderId}`);
  } else {
    console.log(`[Inventory] No SKU mappings found for order ${shopifyOrderId}`);
  }
}

async function handleComplianceWebhook(
  supabase: any,
  shopDomain: string,
  topic: string,
  payload: any
) {
  console.log(`[Compliance] Handling ${topic} for ${shopDomain}`);

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

  await supabase
    .from('compliance_webhooks')
    .insert({
      webhook_type: webhookType,
      shop_domain: shopDomain,
      payload,
      processed: false,
    });

  console.log(`[Compliance] Logged: ${webhookType}`);
}

async function handleFulfillmentOrderWebhook(
  supabase: any,
  clientId: string,
  payload: any
) {
  console.log(`[Fulfillment] Handling routing for client ${clientId}`);
  
  const fulfillmentOrder = payload.fulfillment_order;
  
  const { error } = await supabase
    .from('shopify_orders')
    .update({ fulfillment_order_id: fulfillmentOrder.id.toString() })
    .eq('shopify_order_id', fulfillmentOrder.order_id.toString())
    .eq('client_id', clientId);
  
  if (error) {
    console.error('[Fulfillment] Update failed:', error);
  } else {
    console.log(`[Fulfillment] Updated order ${fulfillmentOrder.order_id}`);
  }
}

async function handleReturnWebhook(
  supabase: any,
  clientId: string,
  topic: string,
  payload: any
) {
  console.log(`[Return] Handling ${topic} for client ${clientId}`);
  
  const returnRequest = payload.return;
  console.log(`[Return] ${returnRequest.id} - Status: ${returnRequest.status}`);
  
  // Return webhooks logged for reference
}