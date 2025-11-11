import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { shopifyGraphQL, shopifyGraphQLPaginated } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReconcileOptions {
  client_id: string;
  mode: 'authoritative' | 'dryRun';
  batchSize?: number;
  pauseMs?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const options: ReconcileOptions = await req.json();
    const { client_id, mode = 'dryRun', batchSize = 80, pauseMs = 250 } = options;

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify scopes and location
    const { data: client } = await serviceClient
      .from('clients')
      .select('shopify_location_id')
      .eq('id', client_id)
      .single();

    if (!client?.shopify_location_id) {
      throw new Error('No Shopify location configured. Run location sync first.');
    }

    const { data: store } = await serviceClient
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .single();

    if (!store) {
      throw new Error('No active Shopify store found');
    }

    // Get all SKUs with inventory item aliases
    const { data: skusWithAliases } = await serviceClient
      .from('sku_aliases')
      .select(`
        alias_value,
        sku_id,
        skus!inner(
          id,
          client_sku,
          client_id
        )
      `)
      .eq('alias_type', 'shopify_inventory_item_id')
      .eq('skus.client_id', client_id);

    if (!skusWithAliases || skusWithAliases.length === 0) {
      throw new Error('No SKUs with Shopify inventory item IDs found');
    }

    // Check for duplicate aliases (conflict detection)
    const aliasMap = new Map<string, string[]>();
    skusWithAliases.forEach(item => {
      const existing = aliasMap.get(item.alias_value) || [];
      existing.push(item.sku_id);
      aliasMap.set(item.alias_value, existing);
    });

    const conflicts = Array.from(aliasMap.entries())
      .filter(([_, skuIds]) => skuIds.length > 1)
      .map(([inventoryItemId, skuIds]) => ({ inventoryItemId, skuIds }));

    if (conflicts.length > 0) {
      console.warn(`⚠️  Found ${conflicts.length} alias conflicts`);
    }

    // Get MAIN location for location-aware quantities
    const { data: mainLocation } = await serviceClient
      .from('locations')
      .select('id')
      .eq('code', 'MAIN')
      .limit(1)
      .maybeSingle();

    if (!mainLocation) throw new Error('MAIN location not found');

    // Get app quantities from inventory ledger (location-aware)
    const skuQuantities = new Map<string, number>();
    for (const item of skusWithAliases) {
      const { data: ledgerSum } = await serviceClient
        .rpc('get_inventory_at_location', { 
          p_sku_id: item.sku_id, 
          p_client_id: client_id,
          p_location_id: mainLocation.id
        });
      
      skuQuantities.set(item.sku_id, ledgerSum || 0);
    }

    // Fetch current Shopify quantities (paginated)
    const inventoryQuery = `
      query getInventoryLevels($locationId: ID!, $cursor: String) {
        location(id: $locationId) {
          inventoryLevels(first: 250, after: $cursor) {
            edges {
              node {
                id
                item {
                  id
                }
                quantities(names: "available") {
                  name
                  quantity
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    const allLevels = await shopifyGraphQLPaginated(
      store.shop_domain,
      store.access_token,
      inventoryQuery,
      'location.inventoryLevels',
      { locationId: `gid://shopify/Location/${client.shopify_location_id}` }
    );

    const shopifyQuantities = new Map<string, number>();
    allLevels.forEach((level: any) => {
      const itemId = level.item.id.split('/').pop();
      const availableQty = level.quantities?.find((q: any) => q.name === 'available')?.quantity || 0;
      shopifyQuantities.set(itemId, availableQty);
    });

    // Build discrepancy report
    const discrepancies = [];
    const updates = [];

    for (const item of skusWithAliases) {
      if (conflicts.some(c => c.inventoryItemId === item.alias_value)) {
        const skuInfo = item.skus as any;
        discrepancies.push({
          sku_id: item.sku_id,
          client_sku: skuInfo.client_sku,
          inventory_item_id: item.alias_value,
          status: 'CONFLICT',
          error: 'Multiple SKUs map to same inventory item',
        });
        continue;
      }

      const appQty = skuQuantities.get(item.sku_id) || 0;
      const shopifyQty = shopifyQuantities.get(item.alias_value) || 0;

      if (appQty !== shopifyQty) {
        const skuInfo = item.skus as any;
        discrepancies.push({
          sku_id: item.sku_id,
          client_sku: skuInfo.client_sku,
          inventory_item_id: item.alias_value,
          app_qty: appQty,
          shopify_qty_before: shopifyQty,
          diff: appQty - shopifyQty,
        });

        if (mode === 'authoritative') {
          updates.push({
            inventoryItemId: item.alias_value,
            quantity: appQty,
            clientSku: skuInfo.client_sku,
            shopify_qty_before: shopifyQty,
          });
        }
      }
    }

    console.log(`Found ${discrepancies.length} discrepancies out of ${skusWithAliases.length} SKUs`);

    let correctedCount = 0;
    const errors = [];
    const itemResults: any[] = [];

    const INVENTORY_ACTIVATE_MUTATION = `
      mutation inventoryActivate($inventoryItemId: ID!, $locationId: ID!) {
        inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId) {
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Execute updates if authoritative mode
    if (mode === 'authoritative' && updates.length > 0) {
      const setQuantityMutation = `
        mutation inventorySetQuantities($input: InventorySetQuantitiesInput!) {
          inventorySetQuantities(input: $input) {
            inventoryAdjustmentGroup {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      // Process in batches
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        
        for (const update of batch) {
          try {
            const result = await shopifyGraphQL(
              store.shop_domain,
              store.access_token,
              setQuantityMutation,
              {
                input: {
                  ignoreCompareQuantity: true,
                  reason: 'correction',
                  name: 'available',
                  quantities: [{
                    inventoryItemId: `gid://shopify/InventoryItem/${update.inventoryItemId}`,
                    locationId: `gid://shopify/Location/${client.shopify_location_id}`,
                    quantity: update.quantity,
                  }]
                }
              }
            );

            if (result.inventorySetQuantities.userErrors.length === 0) {
              correctedCount++;
              itemResults.push({
                sku: update.clientSku,
                was: update.shopify_qty_before || 0,
                now: update.quantity,
                status: 'updated'
              });
            } else {
              const userErrors = result.inventorySetQuantities.userErrors;
              const notStockedError = userErrors.find((e: any) => 
                e.message.includes('not stocked') || e.message.includes('must be stocked')
              );

              if (notStockedError) {
                // Auto-activate and retry
                console.log(`🔧 Auto-activating ${update.clientSku} at location...`);
                await shopifyGraphQL(store.shop_domain, store.access_token, INVENTORY_ACTIVATE_MUTATION, {
                  inventoryItemId: `gid://shopify/InventoryItem/${update.inventoryItemId}`,
                  locationId: `gid://shopify/Location/${client.shopify_location_id}`
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                // Retry
                const retryResult = await shopifyGraphQL(
                  store.shop_domain,
                  store.access_token,
                  setQuantityMutation,
                  {
                    input: {
                      ignoreCompareQuantity: true,
                      reason: 'correction',
                      name: 'available',
                      quantities: [{
                        inventoryItemId: `gid://shopify/InventoryItem/${update.inventoryItemId}`,
                        locationId: `gid://shopify/Location/${client.shopify_location_id}`,
                        quantity: update.quantity,
                      }]
                    }
                  }
                );

                if (retryResult.inventorySetQuantities.userErrors.length === 0) {
                  correctedCount++;
                  itemResults.push({
                    sku: update.clientSku,
                    was: update.shopify_qty_before || 0,
                    now: update.quantity,
                    status: 'updated_after_activation'
                  });
                } else {
                  errors.push({
                    sku: update.clientSku,
                    error: retryResult.inventorySetQuantities.userErrors[0].message
                  });
                  itemResults.push({
                    sku: update.clientSku,
                    status: 'error',
                    error: retryResult.inventorySetQuantities.userErrors[0].message
                  });
                }
              } else {
                errors.push({
                  sku: update.clientSku,
                  error: userErrors[0].message
                });
                itemResults.push({
                  sku: update.clientSku,
                  status: 'error',
                  error: userErrors[0].message
                });
              }
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            errors.push({ sku: update.clientSku, error: errorMessage });
            itemResults.push({
              sku: update.clientSku,
              status: 'error',
              error: errorMessage
            });
          }

          await new Promise(resolve => setTimeout(resolve, pauseMs));
        }
      }
    } else if (mode === 'dryRun' && discrepancies.length > 0) {
      itemResults.push(...discrepancies.map(d => ({
        sku: d.client_sku,
        current: d.shopify_qty_before,
        target: d.app_qty,
        delta: d.diff,
        status: 'would_update'
      })));
    }

    const durationMs = Date.now() - startTime;

    // Create sync log with detailed results
    await serviceClient.from('sync_logs').insert({
      client_id,
      sync_type: 'inventory_reconciliation',
      status: mode === 'dryRun' ? 'success' : (errors.length > 0 ? 'partial' : 'success'),
      products_synced: correctedCount,
      duration_ms: durationMs,
      error_message: errors.length > 0 ? JSON.stringify(errors.slice(0, 100)) : null,
      metadata: {
        mode,
        total_skus: skusWithAliases.length,
        discrepancies_found: discrepancies.length,
        corrections_applied: correctedCount,
        conflicts: conflicts.length,
        item_results: itemResults.slice(0, 50),
        location_id: client.shopify_location_id
      }
    });

    // Audit log
    await serviceClient.from('audit_log').insert({
      user_id: user.id,
      action: 'INVENTORY_RECONCILE',
      table_name: 'shopify_stores',
      record_id: client_id,
      new_data: {
        mode,
        discrepancies: discrepancies.length,
        corrected: correctedCount,
        conflicts: conflicts.length,
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        mode,
        summary: {
          total_skus: skusWithAliases.length,
          discrepancies_found: discrepancies.length,
          corrections_applied: correctedCount,
          conflicts: conflicts.length,
          errors: errors.length,
          duration_ms: durationMs,
        },
        discrepancies: discrepancies.slice(0, 100),
        conflicts,
        errors: errors.slice(0, 20),
        item_results: itemResults.slice(0, 50)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Reconcile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
