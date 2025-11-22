import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { shopifyGraphQLPaginated, shopifyGraphQL } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Comprehensive Shopify Auto-Sync
 * Syncs: Products, Orders, and Inventory Levels (100% GraphQL)
 */

// GraphQL Queries
const PRODUCTS_QUERY = `
  query getProducts($cursor: String) {
    products(first: 250, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          variants(first: 100) {
            edges {
              node {
                id
                sku
                title
                price
                inventoryItem {
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

const ORDERS_QUERY = `
  query getOrders($cursor: String, $query: String) {
    orders(first: 50, after: $cursor, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          email
          createdAt
          updatedAt
          financialStatus
          fulfillmentStatus
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 100) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  sku
                }
              }
            }
          }
        }
      }
    }
  }
`;

const INVENTORY_LEVELS_QUERY = `
  query getInventoryLevels($locationId: ID!, $cursor: String) {
    location(id: $locationId) {
      inventoryLevels(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            available
            item {
              id
              sku
              variant {
                id
              }
            }
          }
        }
      }
    }
  }
`;

async function syncProducts(supabase: any, clientId: string, store: any) {
  console.log(`[${clientId}] Syncing products...`);
  
  const rawProducts = await shopifyGraphQLPaginated(
    store.shop_domain,
    store.access_token,
    PRODUCTS_QUERY,
    'products'
  );

  const products = rawProducts.map((product: any) => ({
    id: product.id.split('/').pop(),
    title: product.title,
    variants: product.variants.edges.map((v: any) => ({
      id: v.node.id.split('/').pop(),
      inventory_item_id: v.node.inventoryItem.id.split('/').pop(),
      sku: v.node.sku,
      title: v.node.title,
      price: v.node.price,
    })),
  }));

  // Get existing SKUs
  const { data: existingSkus } = await supabase
    .from('skus')
    .select('client_sku, internal_sku')
    .eq('client_id', clientId);

  const existingSkuMap = new Map(existingSkus?.map((s: any) => [s.client_sku, s.internal_sku]) || []);

  const skusToInsert = [];
  const skusToUpdate = [];

  for (const product of products) {
    for (const variant of product.variants) {
      const clientSku = variant.sku || `SHOP-${product.id}-${variant.id}`;
      const title = variant.title !== 'Default Title' 
        ? `${product.title} - ${variant.title}`
        : product.title;
      
      const skuData = {
        client_id: clientId,
        client_sku: clientSku,
        title,
        unit_cost: parseFloat(variant.price) || 0,
        notes: `Shopify Product ID: ${product.id}, Variant ID: ${variant.id}`,
        status: 'active' as const,
      };

      if (existingSkuMap.has(clientSku)) {
        skusToUpdate.push(skuData);
      } else {
        skusToInsert.push({
          ...skuData,
          internal_sku: variant.sku || `SHOP-${product.id}-${variant.id}`,
        });
      }
    }
  }

  // Insert new SKUs
  if (skusToInsert.length > 0) {
    const { error } = await supabase.from('skus').insert(skusToInsert);
    if (error) throw error;
  }

  // Update existing SKUs
  if (skusToUpdate.length > 0) {
    const { error } = await supabase.from('skus').upsert(skusToUpdate, {
      onConflict: 'client_id,client_sku',
      ignoreDuplicates: false,
    });
    if (error) throw error;
  }

  // Create sku_aliases
  const aliasesToInsert = [];
  for (const product of products) {
    for (const variant of product.variants) {
      const clientSku = variant.sku || `SHOP-${product.id}-${variant.id}`;
      
      const { data: skuRecord } = await supabase
        .from('skus')
        .select('id')
        .eq('client_id', clientId)
        .eq('client_sku', clientSku)
        .single();

      if (skuRecord) {
        // Create BOTH inventory_item_id AND variant_id aliases
        aliasesToInsert.push(
          {
            sku_id: skuRecord.id,
            alias_type: 'shopify_inventory_item_id',
            alias_value: variant.inventory_item_id.toString(),
          },
          {
            sku_id: skuRecord.id,
            alias_type: 'shopify_variant_id',
            alias_value: variant.id.toString(),
          }
        );
      }
    }
  }

  if (aliasesToInsert.length > 0) {
    await supabase.from('sku_aliases').upsert(aliasesToInsert, {
      onConflict: 'sku_id,alias_type,alias_value',
    });
  }

  return skusToInsert.length + skusToUpdate.length;
}

async function syncOrders(supabase: any, clientId: string, store: any, lastSyncAt?: string) {
  console.log(`[${clientId}] Syncing orders...`);
  
  // PHASE 3 FIX: Use last successful sync timestamp (or default to 7 days for first run)
  let queryTimestamp = lastSyncAt;
  if (!queryTimestamp) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    queryTimestamp = sevenDaysAgo;
    console.log(`[${clientId}] First sync, fetching orders from last 7 days`);
  } else {
    console.log(`[${clientId}] Incremental sync from ${queryTimestamp}`);
  }
  
  const query = `updated_at:>='${queryTimestamp}'`;

  const rawOrders = await shopifyGraphQLPaginated(
    store.shop_domain,
    store.access_token,
    ORDERS_QUERY,
    'orders',
    { query }
  );

  const ordersToUpsert = rawOrders.map((order: any) => ({
    client_id: clientId,
    shopify_order_id: order.id.split('/').pop(),
    order_number: order.name,
    email: order.email,
    financial_status: order.financialStatus,
    fulfillment_status: order.fulfillmentStatus || 'unfulfilled',
    total_price: parseFloat(order.totalPriceSet?.shopMoney?.amount || '0'),
    currency: order.totalPriceSet?.shopMoney?.currencyCode || 'USD',
    line_items: order.lineItems.edges.map((edge: any) => ({
      title: edge.node.title,
      quantity: edge.node.quantity,
      variant_id: edge.node.variant?.id?.split('/').pop(),
      sku: edge.node.variant?.sku,
    })),
    created_at_shopify: order.createdAt,
    updated_at_shopify: order.updatedAt,
  }));

  if (ordersToUpsert.length > 0) {
    const { error } = await supabase
      .from('shopify_orders')
      .upsert(ordersToUpsert, {
        onConflict: 'client_id,shopify_order_id',
      });
    if (error) throw error;
  }

  return ordersToUpsert.length;
}

async function reconcileInventory(supabase: any, clientId: string, store: any) {
  console.log(`[${clientId}] Reconciling inventory...`);
  
  // Get client's Shopify location ID
  const { data: client } = await supabase
    .from('clients')
    .select('shopify_location_id')
    .eq('id', clientId)
    .single();

  if (!client?.shopify_location_id) {
    console.log(`[${clientId}] No Shopify location configured, skipping inventory reconciliation`);
    return [];
  }

  const locationGid = `gid://shopify/Location/${client.shopify_location_id}`;

  const rawLevels = await shopifyGraphQLPaginated(
    store.shop_domain,
    store.access_token,
    INVENTORY_LEVELS_QUERY,
    'location.inventoryLevels',
    { locationId: locationGid }
  );

  // PHASE 3 P3: Batch reconciliation to prevent timeouts
  const discrepancies = [];
  const BATCH_SIZE = 100;
  let processedCount = 0;

  for (let i = 0; i < rawLevels.length; i += BATCH_SIZE) {
    const batch = rawLevels.slice(i, i + BATCH_SIZE);
    console.log(`[${clientId}] Processing reconciliation batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rawLevels.length / BATCH_SIZE)}`);
    
    for (const level of batch) {
      const inventoryItemId = level.item.id.split('/').pop();
      const shopifyQty = level.available || 0;

      // Find SKU by inventory_item_id with client_id filter
      const { data: alias } = await supabase
        .from('sku_aliases')
        .select('sku_id, skus!inner(client_id)')
        .eq('alias_type', 'shopify_inventory_item_id')
        .eq('alias_value', inventoryItemId)
        .eq('skus.client_id', clientId)
        .maybeSingle();

      if (!alias) continue;

      // PHASE 3 C5: Use SQL aggregation function instead of JS reduce
      const { data: ledgerSum } = await supabase
        .rpc('sum_inventory_ledger', { 
          p_sku_id: alias.sku_id, 
          p_client_id: clientId 
        });

      const appQty = ledgerSum || 0;

      if (shopifyQty !== appQty) {
        discrepancies.push({
          sku_id: alias.sku_id,
          shopify_qty: shopifyQty,
          app_qty: appQty,
          difference: shopifyQty - appQty,
        });
      }
    }
    
    processedCount += batch.length;
    
    // Brief pause between batches to avoid overwhelming database
    if (i + BATCH_SIZE < rawLevels.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`[${clientId}] ✓ Reconciliation complete: ${processedCount} SKUs processed`);

  if (discrepancies.length > 0) {
    console.log(`[${clientId}] Found ${discrepancies.length} discrepancies, auto-correcting to match app inventory...`);
    
    // PHASE 4 M6: Add retry logic for Shopify inventory pushes
    let corrected = 0;
    const MAX_RETRIES = 3;
    
    for (const disc of discrepancies) {
      try {
        // Get SKU details for logging
        const { data: skuData } = await supabase
          .from('skus')
          .select('client_sku')
          .eq('id', disc.sku_id)
          .single();

        const clientSku = skuData?.client_sku || disc.sku_id;

        let success = false;
        let lastError = null;

        // Retry push up to 3 times with exponential backoff
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          const { data: pushResult, error: pushError } = await supabase.functions.invoke(
            'shopify-push-inventory-single',
            { body: { client_id: clientId, sku_id: disc.sku_id } }
          );
          
          if (!pushError && pushResult?.success) {
            success = true;
            corrected++;
            console.log(`✓ Corrected ${clientSku}: ${disc.shopify_qty} → ${disc.app_qty} (attempt ${attempt})`);
            break;
          } else {
            lastError = pushError || pushResult?.error;
            if (attempt < MAX_RETRIES) {
              const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
              console.log(`⚠️  Retry ${attempt}/${MAX_RETRIES} for ${clientSku} after ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }

        if (!success) {
          console.error(`❌ Failed to correct ${clientSku} after ${MAX_RETRIES} attempts:`, lastError);
          // Log to inventory_audit_log for tracking
          await supabase.from('inventory_audit_log').insert({
            client_id: clientId,
            sku_id: disc.sku_id,
            app_inventory: disc.app_qty,
            shopify_inventory: disc.shopify_qty,
            difference: disc.shopify_qty - disc.app_qty,
            inventory_item_id: 'unknown',
            location_id: 'unknown',
            status: 'pending',
            auto_correction_attempted: true,
            auto_correction_success: false,
            audit_type: 'post_sync',
            resolution_notes: `Auto-correction failed: ${lastError}`,
          });
        }
      } catch (err) {
        console.error(`Error correcting discrepancy:`, err);
      }
    }
    
    console.log(`Auto-corrected ${corrected}/${discrepancies.length} discrepancies`);
  }

  return discrepancies;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Starting comprehensive sync...');

    // Get all clients that need syncing
    const { data: configsToSync } = await supabase
      .from('shopify_sync_config')
      .select('*')
      .eq('auto_sync_enabled', true)
      .lte('next_sync_at', new Date().toISOString());

    console.log(`Found ${configsToSync?.length || 0} clients to sync`);

    const results = [];

    for (const config of configsToSync || []) {
      const startTime = Date.now();
      
      try {
        console.log(`Syncing client ${config.client_id}...`);

        // Create sync log
        const { data: logEntry } = await supabase
          .from('sync_logs')
          .insert({
            client_id: config.client_id,
            sync_type: 'comprehensive',
            status: 'in_progress',
          })
          .select()
          .single();

        // Get store credentials
        const { data: store } = await supabase
          .from('shopify_stores')
          .select('shop_domain, access_token')
          .eq('client_id', config.client_id)
          .eq('is_active', true)
          .single();

        if (!store) throw new Error('Store not found');

        // Sync products
        const productsSynced = await syncProducts(supabase, config.client_id, store);

        // PHASE 3 FIX: Pass last successful sync timestamp to orders sync
        const ordersSynced = await syncOrders(supabase, config.client_id, store, config.last_sync_at);

        // Reconcile inventory
        const inventoryDiscrepancies = await reconcileInventory(supabase, config.client_id, store);

        const duration = Date.now() - startTime;

        // Calculate next sync time
        const now = new Date();
        let nextSync = new Date(now);
        switch (config.sync_frequency) {
          case '5min':
            nextSync.setMinutes(now.getMinutes() + 5);
            break;
          case 'hourly':
            nextSync.setHours(now.getHours() + 1);
            break;
          case 'daily':
            nextSync.setDate(now.getDate() + 1);
            break;
          case 'weekly':
            nextSync.setDate(now.getDate() + 7);
            break;
        }

        // Update sync config
        await supabase
          .from('shopify_sync_config')
          .update({
            last_sync_at: new Date().toISOString(),
            next_sync_at: nextSync.toISOString(),
            last_sync_status: 'success',
            last_sync_product_count: productsSynced,
          })
          .eq('id', config.id);

        // Update sync log
        if (logEntry) {
          await supabase
            .from('sync_logs')
            .update({
              status: 'success',
              products_synced: productsSynced,
              duration_ms: duration,
              error_message: inventoryDiscrepancies.length > 0 
                ? `${inventoryDiscrepancies.length} inventory discrepancies found` 
                : null,
            })
            .eq('id', logEntry.id);
        }

        results.push({
          client_id: config.client_id,
          success: true,
          products: productsSynced,
          orders: ordersSynced,
          inventory_discrepancies: inventoryDiscrepancies.length,
        });

        console.log(`✓ Client ${config.client_id}: ${productsSynced} products, ${ordersSynced} orders`);
      } catch (error) {
        console.error(`✗ Client ${config.client_id} failed:`, error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        await supabase
          .from('shopify_sync_config')
          .update({ last_sync_status: 'failed' })
          .eq('id', config.id);

        const { data: failedLog } = await supabase
          .from('sync_logs')
          .select('id')
          .eq('client_id', config.client_id)
          .eq('status', 'in_progress')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (failedLog) {
          await supabase
            .from('sync_logs')
            .update({
              status: 'failed',
              error_message: errorMessage,
              duration_ms: Date.now() - startTime,
            })
            .eq('id', failedLog.id);
        }

        results.push({
          client_id: config.client_id,
          success: false,
          error: errorMessage,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Comprehensive sync error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
