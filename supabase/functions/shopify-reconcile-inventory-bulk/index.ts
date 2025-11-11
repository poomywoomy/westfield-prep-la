import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { shopifyGraphQL } from '../_shared/shopify-graphql.ts';

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

    // Get app quantities from inventory ledger
    const skuQuantities = new Map<string, number>();
    for (const item of skusWithAliases) {
      const { data: ledgerSum } = await serviceClient
        .rpc('get_current_inventory', { 
          p_sku_id: item.sku_id, 
          p_client_id: client_id 
        });
      
      skuQuantities.set(item.sku_id, ledgerSum || 0);
    }

    // Fetch current Shopify quantities
    const inventoryQuery = `
      query getInventoryLevels($locationId: ID!) {
        location(id: $locationId) {
          inventoryLevels(first: 250) {
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

    const shopifyData = await shopifyGraphQL(
      store.shop_domain,
      store.access_token,
      inventoryQuery,
      { locationId: `gid://shopify/Location/${client.shopify_location_id}` }
    );

    const shopifyQuantities = new Map<string, number>();
    shopifyData.location?.inventoryLevels?.edges?.forEach((edge: any) => {
      const itemId = edge.node.item.id.split('/').pop();
      const availableQty = edge.node.quantities?.find((q: any) => q.name === 'available')?.quantity || 0;
      shopifyQuantities.set(itemId, availableQty);
    });

    // Build discrepancy report
    const discrepancies = [];
    const updates = [];

    for (const item of skusWithAliases) {
      if (conflicts.some(c => c.inventoryItemId === item.alias_value)) {
        discrepancies.push({
          sku_id: item.sku_id,
          client_sku: item.skus.client_sku,
          inventory_item_id: item.alias_value,
          status: 'CONFLICT',
          error: 'Multiple SKUs map to same inventory item',
        });
        continue;
      }

      const appQty = skuQuantities.get(item.sku_id) || 0;
      const shopifyQty = shopifyQuantities.get(item.alias_value) || 0;

      if (appQty !== shopifyQty) {
        discrepancies.push({
          sku_id: item.sku_id,
          client_sku: item.skus.client_sku,
          inventory_item_id: item.alias_value,
          app_qty: appQty,
          shopify_qty_before: shopifyQty,
          diff: appQty - shopifyQty,
        });

        if (mode === 'authoritative') {
          updates.push({
            inventoryItemId: item.alias_value,
            quantity: appQty,
            clientSku: item.skus.client_sku,
          });
        }
      }
    }

    console.log(`Found ${discrepancies.length} discrepancies out of ${skusWithAliases.length} SKUs`);

    let correctedCount = 0;
    const errors = [];

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
            } else {
              errors.push({
                sku: update.clientSku,
                error: result.inventorySetQuantities.userErrors[0].message
              });
            }
          } catch (err) {
            errors.push({ sku: update.clientSku, error: err.message });
          }

          await new Promise(resolve => setTimeout(resolve, pauseMs));
        }
      }
    }

    const durationMs = Date.now() - startTime;

    // Create sync log
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
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Reconcile error:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
