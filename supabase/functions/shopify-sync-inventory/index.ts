import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
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

    // Get client info with Shopify location
    const { data: client } = await serviceClient
      .from('clients')
      .select('id, shopify_location_id')
      .eq('id', client_id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    // Get store credentials
    const { data: store } = await serviceClient
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .single();

    if (!store) {
      throw new Error('Store not found or inactive');
    }

    // Ensure we have a Shopify location ID (auto-fetch if missing)
    let locationId = client.shopify_location_id;
    if (!locationId) {
      console.log('⚠️  No Shopify location configured, fetching from Shopify...');
      
      const locationsQuery = `
        query getLocations {
          locations(first: 10) {
            edges {
              node {
                id
                name
                isActive
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

      const locations = locationsData.locations.edges.map((edge: any) => edge.node);
      const primaryLocation = locations.find((loc: any) => loc.isActive) || locations[0];
      
      if (!primaryLocation) {
        throw new Error('No Shopify location found. Please connect your store via admin dashboard first.');
      }

      locationId = primaryLocation.id.split('/').pop();
      
      // Store for future use
      await serviceClient
        .from('clients')
        .update({ shopify_location_id: locationId })
        .eq('id', client_id);
      
      console.log(`✓ Auto-saved Shopify location ${locationId}`);
    }

    // Start sync log
    const { data: syncLog } = await serviceClient
      .from('sync_logs')
      .insert({
        client_id: client_id,
        sync_type: 'inventory',
        status: 'in_progress',
        products_synced: 0,
        triggered_by: user.id,
      })
      .select()
      .single();

    if (syncLog) {
      syncLogId = syncLog.id;
    }

    // Get all SKUs for this client
    const { data: skus } = await serviceClient
      .from('skus')
      .select('id, client_sku')
      .eq('client_id', client_id);

    if (!skus || skus.length === 0) {
      const durationMs = Date.now() - startTime;
      if (syncLogId) {
        await serviceClient
          .from('sync_logs')
          .update({
            status: 'success',
            products_synced: 0,
            duration_ms: durationMs,
          })
          .eq('id', syncLogId);
      }

      return new Response(
        JSON.stringify({ success: true, synced: 0, message: 'No SKUs found for this client' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    let synced = 0;
    const errors = [];

    for (const sku of skus) {
      try {
        // Find Shopify inventory_item_id via sku_aliases
        const { data: alias } = await serviceClient
          .from('sku_aliases')
          .select('alias_value')
          .eq('sku_id', sku.id)
          .eq('alias_type', 'shopify_inventory_item_id')
          .single();

        if (!alias) {
          errors.push({ sku: sku.client_sku, error: 'No Shopify inventory_item_id mapping found' });
          continue;
        }

        const inventoryItemId = alias.alias_value;

        // Compute westfield_quantity from inventory_ledger
        const { data: ledgerEntries } = await serviceClient
          .from('inventory_ledger')
          .select('qty_delta')
          .eq('sku_id', sku.id);

        const westfieldQuantity = ledgerEntries?.reduce((sum, entry) => sum + entry.qty_delta, 0) || 0;

        // Update inventory level via GraphQL mutation
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

        const inventoryLevelId = `gid://shopify/InventoryLevel/${inventoryItemId}?inventory_location_id=${locationId}`;

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
              quantity: westfieldQuantity,
            }
          ],
        }
      }
    );

        if (mutationResult.inventorySetQuantities?.userErrors?.length > 0) {
          const errors = mutationResult.inventorySetQuantities.userErrors;
          throw new Error(`Failed to update ${sku.client_sku}: ${JSON.stringify(errors)}`);
        }

        synced++;
      } catch (error) {
        console.error(`Error syncing ${sku.client_sku}:`, error);
        errors.push({ sku: sku.client_sku, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    const durationMs = Date.now() - startTime;

    // Update sync log
    if (syncLogId) {
      await serviceClient
        .from('sync_logs')
        .update({
          status: 'success',
          products_synced: synced,
          duration_ms: durationMs,
          error_message: errors.length > 0 ? JSON.stringify(errors) : null,
        })
        .eq('id', syncLogId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced,
        total: skus.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Inventory sync error:', error);
    
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

    const errorMessage = error instanceof Error ? error.message : 'Unable to sync inventory with Shopify. Please try again or contact support.';
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
