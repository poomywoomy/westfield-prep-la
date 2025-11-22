import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { shopifyGraphQLPaginated, shopifyGraphQL } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const INVENTORY_LEVELS_QUERY = `
  query getInventoryLevels($locationId: ID!) {
    location(id: $locationId) {
      inventoryLevels(first: 250) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            available
            item {
              id
              sku
            }
          }
        }
      }
    }
  }
`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { client_id, audit_type = 'scheduled' } = body;

    console.log(`[Inventory Audit] Starting ${audit_type} audit${client_id ? ` for client ${client_id}` : ' for all clients'}`);

    // Get clients to audit
    let clientsToAudit: Array<{ id: string; company_name: string; auto_correct?: boolean }> = [];
    if (client_id) {
      const { data: singleClient } = await supabase
        .from('clients')
        .select('id, company_name')
        .eq('id', client_id)
        .single();
      
      if (singleClient) {
        clientsToAudit = [singleClient];
      }
    } else {
      // Audit all clients with active Shopify stores and audit enabled
      const { data: configs } = await supabase
        .from('shopify_sync_config')
        .select('client_id, auto_correct_discrepancies, clients(id, company_name)')
        .eq('inventory_audit_enabled', true);
      
      clientsToAudit = configs?.map((config: any) => ({
        id: config.client_id,
        company_name: config.clients?.company_name,
        auto_correct: config.auto_correct_discrepancies,
      })) || [];
    }

    console.log(`[Inventory Audit] Auditing ${clientsToAudit.length} clients`);

    const auditResults = [];

    for (const client of clientsToAudit) {
      try {
        console.log(`[Inventory Audit] Processing client: ${client.company_name}`);

        // Get Shopify store
        const { data: store } = await supabase
          .from('shopify_stores')
          .select('shop_domain, access_token')
          .eq('client_id', client.id)
          .eq('is_active', true)
          .maybeSingle();

        if (!store) {
          console.log(`[Inventory Audit] No active Shopify store for ${client.company_name}`);
          continue;
        }

        // Get client's location
        const { data: clientData } = await supabase
          .from('clients')
          .select('shopify_location_id')
          .eq('id', client.id)
          .single();

        if (!clientData?.shopify_location_id) {
          console.log(`[Inventory Audit] No location configured for ${client.company_name}`);
          continue;
        }

        const locationGid = `gid://shopify/Location/${clientData.shopify_location_id}`;

        // Fetch inventory from Shopify
        const shopifyInventory = await shopifyGraphQLPaginated(
          store.shop_domain,
          store.access_token,
          INVENTORY_LEVELS_QUERY,
          'location.inventoryLevels',
          { locationId: locationGid }
        );

        console.log(`[Inventory Audit] Fetched ${shopifyInventory.length} items from Shopify`);

        const discrepancies = [];
        let skusChecked = 0;

        for (const level of shopifyInventory) {
          const inventoryItemId = level.item.id.split('/').pop();
          const shopifyQty = level.available || 0;

          // Find SKU by inventory_item_id
          const { data: alias } = await supabase
            .from('sku_aliases')
            .select('sku_id, skus!inner(client_id)')
            .eq('alias_type', 'shopify_inventory_item_id')
            .eq('alias_value', inventoryItemId)
            .eq('skus.client_id', client.id)
            .maybeSingle();

          if (!alias) continue;

          skusChecked++;

          // Get app inventory from ledger
          const { data: appQtyData } = await supabase
            .rpc('sum_inventory_ledger', {
              p_sku_id: alias.sku_id,
              p_client_id: client.id,
            });

          const appQty = appQtyData || 0;

          if (shopifyQty !== appQty) {
            const difference = shopifyQty - appQty;
            
            discrepancies.push({
              client_id: client.id,
              sku_id: alias.sku_id,
              inventory_item_id: inventoryItemId,
              location_id: clientData.shopify_location_id,
              app_inventory: appQty,
              shopify_inventory: shopifyQty,
              difference: difference,
              audit_type: audit_type,
              status: 'pending',
              auto_correction_attempted: false,
            });

            console.log(`[Inventory Audit] Discrepancy found: SKU ${alias.sku_id} - App: ${appQty}, Shopify: ${shopifyQty}, Diff: ${difference}`);
          }
        }

        // Log all discrepancies
        if (discrepancies.length > 0) {
          const { error: logError } = await supabase
            .from('inventory_audit_log')
            .insert(discrepancies);

          if (logError) {
            console.error(`[Inventory Audit] Failed to log discrepancies:`, logError);
          } else {
            console.log(`[Inventory Audit] Logged ${discrepancies.length} discrepancies`);
          }

          // Auto-correct if enabled
          const autoCorrect = client.auto_correct !== false; // Default to true
          if (autoCorrect) {
            console.log(`[Inventory Audit] Auto-correcting ${discrepancies.length} discrepancies...`);
            
            let corrected = 0;
            for (const disc of discrepancies) {
              try {
                const { data: pushResult, error: pushError } = await supabase.functions.invoke(
                  'shopify-push-inventory-single',
                  { body: { client_id: client.id, sku_id: disc.sku_id } }
                );

                if (!pushError && pushResult?.success) {
                  corrected++;
                  
                  // Update audit log
                  await supabase
                    .from('inventory_audit_log')
                    .update({
                      auto_correction_attempted: true,
                      auto_correction_success: true,
                      status: 'auto_corrected',
                      resolved_at: new Date().toISOString(),
                    })
                    .eq('sku_id', disc.sku_id)
                    .eq('client_id', client.id)
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false })
                    .limit(1);
                } else {
                  console.error(`[Inventory Audit] Failed to correct SKU ${disc.sku_id}`);
                  
                  // Mark as failed correction
                  await supabase
                    .from('inventory_audit_log')
                    .update({
                      auto_correction_attempted: true,
                      auto_correction_success: false,
                      resolution_notes: pushError?.message || 'Push failed',
                    })
                    .eq('sku_id', disc.sku_id)
                    .eq('client_id', client.id)
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false })
                    .limit(1);
                }
              } catch (correctionError) {
                console.error(`[Inventory Audit] Error correcting discrepancy:`, correctionError);
              }
            }

            console.log(`[Inventory Audit] Auto-corrected ${corrected}/${discrepancies.length} discrepancies`);
          }
        }

        auditResults.push({
          client_id: client.id,
          company_name: client.company_name,
          skus_checked: skusChecked,
          discrepancies_found: discrepancies.length,
          auto_corrected: client.auto_correct ? discrepancies.length : 0,
        });

      } catch (clientError) {
        console.error(`[Inventory Audit] Error processing client ${client.company_name}:`, clientError);
        auditResults.push({
          client_id: client.id,
          company_name: client.company_name,
          error: clientError instanceof Error ? clientError.message : 'Unknown error',
        });
      }
    }

    const durationMs = Date.now() - startTime;

    // Log audit summary
    const totalDiscrepancies = auditResults.reduce((sum, r) => sum + (r.discrepancies_found || 0), 0);
    const totalCorrected = auditResults.reduce((sum, r) => sum + (r.auto_corrected || 0), 0);

    console.log(`[Inventory Audit] ✓ Audit complete: ${totalDiscrepancies} discrepancies found, ${totalCorrected} corrected (${durationMs}ms)`);

    await supabase.from('sync_logs').insert({
      client_id: client_id || null,
      sync_type: 'inventory_audit',
      status: 'success',
      products_synced: auditResults.reduce((sum, r) => sum + (r.skus_checked || 0), 0),
      duration_ms: durationMs,
      discrepancies_found: totalDiscrepancies,
      discrepancies_corrected: totalCorrected,
      location_id_used: null,
      location_source: 'unknown',
    });

    return new Response(
      JSON.stringify({
        success: true,
        audit_type: audit_type,
        clients_audited: auditResults.length,
        total_discrepancies: totalDiscrepancies,
        total_corrected: totalCorrected,
        duration_ms: durationMs,
        results: auditResults,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('[Inventory Audit] Fatal error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
