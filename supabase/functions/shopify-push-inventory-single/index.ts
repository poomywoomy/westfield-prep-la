import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { shopifyGraphQL } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  // PHASE 2 FIX: Declare body at function scope to avoid variable scope issues
  let body: any;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // C6 FIX: Parse body once and store it to avoid double parsing
    body = await req.json();
    const { client_id, sku_id } = body;

    if (!client_id || !sku_id) {
      throw new Error('Missing required parameters: client_id and sku_id');
    }

    // Check if client has active Shopify store
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .maybeSingle();

    if (!store) {
      console.log(`No active Shopify store for client ${client_id}`);
      return new Response(
        JSON.stringify({ success: false, message: 'No active Shopify store' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Get client's Shopify location
    const { data: client } = await supabase
      .from('clients')
      .select('shopify_location_id')
      .eq('id', client_id)
      .single();

    let locationId = client?.shopify_location_id;

    // Auto-fetch and store location if missing (with improved validation)
    if (!locationId) {
      console.log(`⚠️  No Shopify location configured for client ${client_id}, fetching...`);
      
      const locationsQuery = `
        query {
          locations(first: 10) {
            edges {
              node {
                id
                name
                isActive
                fulfillsOnlineOrders
              }
            }
          }
        }
      `;

      const locationsData = await shopifyGraphQL(
        store.shop_domain,
        store.access_token,
        locationsQuery
      );

      const activeLocation = locationsData.locations.edges.find(
        (edge: any) => edge.node.isActive && edge.node.fulfillsOnlineOrders
      )?.node || locationsData.locations.edges[0]?.node;

      if (!activeLocation) {
        throw new Error('No Shopify location found. Please sync location from admin dashboard first.');
      }

      // Extract numeric ID from GID
      locationId = activeLocation.id.split('/').pop();

      // Save to clients table for future use
      await supabase
        .from('clients')
        .update({ shopify_location_id: locationId })
        .eq('id', client_id);

      console.log(`✓ Auto-saved Shopify location ${locationId} for client ${client_id}`);
    }

    // Get SKU info
    const { data: sku } = await supabase
      .from('skus')
      .select('id, client_sku')
      .eq('id', sku_id)
      .single();

    if (!sku) {
      throw new Error('SKU not found');
    }

    // Get Shopify inventory_item_id from sku_aliases
    const { data: alias } = await supabase
      .from('sku_aliases')
      .select('alias_value')
      .eq('sku_id', sku_id)
      .eq('alias_type', 'shopify_inventory_item_id')
      .maybeSingle();

    if (!alias) {
      console.log(`No Shopify mapping for SKU ${sku.client_sku}`);
      return new Response(
        JSON.stringify({ success: false, message: 'SKU not mapped to Shopify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const inventoryItemId = alias.alias_value;

    // Calculate current inventory from ledger
    const { data: ledgerEntries } = await supabase
      .from('inventory_ledger')
      .select('qty_delta')
      .eq('sku_id', sku_id);

    const currentQty = ledgerEntries?.reduce((sum, entry) => sum + entry.qty_delta, 0) || 0;

    // Update Shopify inventory via GraphQL
    const inventoryMutation = `
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

    const mutationResult = await shopifyGraphQL(
      store.shop_domain,
      store.access_token,
      inventoryMutation,
      {
        input: {
          reason: 'correction',
          name: 'available',
          ignoreCompareQuantity: true,
          quantities: [
            {
              inventoryItemId: `gid://shopify/InventoryItem/${inventoryItemId}`,
              locationId: `gid://shopify/Location/${locationId}`,
              quantity: currentQty,
            }
          ],
        }
      }
    );

    if (mutationResult.inventorySetQuantities?.userErrors?.length > 0) {
      const errors = mutationResult.inventorySetQuantities.userErrors;
      throw new Error(`Shopify API error: ${JSON.stringify(errors)}`);
    }

    const durationMs = Date.now() - startTime;

    // Log to sync_logs
    await supabase.from('sync_logs').insert({
      client_id,
      sync_type: 'inventory_push_single',
      status: 'success',
      products_synced: 1,
      duration_ms: durationMs,
    });

    console.log(`✓ Synced ${sku.client_sku} to Shopify: ${currentQty} units (${durationMs}ms)`);

    return new Response(
      JSON.stringify({ success: true, sku: sku.client_sku, quantity: currentQty }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Shopify inventory push error:', error);

    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // C6 FIX: Use already parsed body (avoid double parsing)
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      await supabase.from('sync_logs').insert({
        client_id: body?.client_id || null,
        sync_type: 'inventory_push_single',
        status: 'failed',
        products_synced: 0,
        duration_ms: durationMs,
        error_message: errorMessage,
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
