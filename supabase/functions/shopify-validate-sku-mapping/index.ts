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

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { client_id, sku_id } = body;

    if (!client_id || !sku_id) {
      throw new Error('Missing required parameters: client_id and sku_id');
    }

    console.log(`[SKU Validation] Validating mapping for SKU ${sku_id}`);

    const validationReport: any = {
      sku_id,
      client_id,
      timestamp: new Date().toISOString(),
      checks: {},
      errors: [],
      warnings: [],
    };

    // 1. Check SKU exists
    const { data: sku, error: skuError } = await supabase
      .from('skus')
      .select('id, client_sku, title, client_id')
      .eq('id', sku_id)
      .single();

    if (skuError || !sku) {
      validationReport.errors.push('SKU not found in database');
      return new Response(
        JSON.stringify({ success: false, validation: validationReport }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    validationReport.sku = {
      client_sku: sku.client_sku,
      title: sku.title,
    };

    // 2. Check client-SKU association
    if (sku.client_id !== client_id) {
      validationReport.errors.push(`SKU belongs to different client: ${sku.client_id}`);
      return new Response(
        JSON.stringify({ success: false, validation: validationReport }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    validationReport.checks.client_association = 'PASS';

    // 3. Check sku_aliases for inventory_item_id
    const { data: inventoryItemAlias } = await supabase
      .from('sku_aliases')
      .select('alias_value')
      .eq('sku_id', sku_id)
      .eq('alias_type', 'shopify_inventory_item_id')
      .maybeSingle();

    if (!inventoryItemAlias) {
      validationReport.errors.push('No shopify_inventory_item_id alias found');
      validationReport.checks.inventory_item_alias = 'FAIL';
    } else {
      validationReport.checks.inventory_item_alias = 'PASS';
      validationReport.inventory_item_id = inventoryItemAlias.alias_value;
    }

    // 4. Check sku_aliases for variant_id
    const { data: variantAlias } = await supabase
      .from('sku_aliases')
      .select('alias_value')
      .eq('sku_id', sku_id)
      .eq('alias_type', 'shopify_variant_id')
      .maybeSingle();

    if (!variantAlias) {
      validationReport.warnings.push('No shopify_variant_id alias found');
      validationReport.checks.variant_alias = 'MISSING';
    } else {
      validationReport.checks.variant_alias = 'PASS';
      validationReport.variant_id = variantAlias.alias_value;
    }

    // 5. Calculate app inventory
    const { data: appQtyData } = await supabase
      .rpc('sum_inventory_ledger', {
        p_sku_id: sku_id,
        p_client_id: client_id,
      });

    validationReport.app_inventory = appQtyData || 0;
    validationReport.checks.app_inventory = 'CALCULATED';

    // 6. Get client's Shopify store and location
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .maybeSingle();

    if (!store) {
      validationReport.errors.push('No active Shopify store for client');
      validationReport.checks.shopify_store = 'FAIL';
      return new Response(
        JSON.stringify({ success: false, validation: validationReport }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    validationReport.checks.shopify_store = 'PASS';

    const { data: client } = await supabase
      .from('clients')
      .select('shopify_location_id')
      .eq('id', client_id)
      .single();

    if (!client?.shopify_location_id) {
      validationReport.errors.push('No Shopify location configured for client');
      validationReport.checks.location_configured = 'FAIL';
      return new Response(
        JSON.stringify({ success: false, validation: validationReport }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    validationReport.location_id = client.shopify_location_id;
    validationReport.checks.location_configured = 'PASS';

    // 7. Validate location exists and is active in Shopify
    try {
      const locationQuery = `
        query {
          location(id: "gid://shopify/Location/${client.shopify_location_id}") {
            id
            name
            isActive
            fulfillsOnlineOrders
          }
        }
      `;

      const locationData = await shopifyGraphQL(
        store.shop_domain,
        store.access_token,
        locationQuery
      );

      if (!locationData.location) {
        validationReport.errors.push(`Location ${client.shopify_location_id} not found in Shopify`);
        validationReport.checks.location_exists_shopify = 'FAIL';
      } else {
        validationReport.checks.location_exists_shopify = 'PASS';
        validationReport.location_details = {
          name: locationData.location.name,
          isActive: locationData.location.isActive,
          fulfillsOnlineOrders: locationData.location.fulfillsOnlineOrders,
        };

        if (!locationData.location.isActive) {
          validationReport.warnings.push('Location is inactive in Shopify');
        }
      }
    } catch (locationError) {
      validationReport.errors.push(`Failed to validate location: ${locationError.message}`);
      validationReport.checks.location_exists_shopify = 'ERROR';
    }

    // 8. Validate inventory_item_id exists in Shopify (if alias found)
    if (inventoryItemAlias) {
      try {
        const itemQuery = `
          query {
            inventoryItem(id: "gid://shopify/InventoryItem/${inventoryItemAlias.alias_value}") {
              id
              tracked
              sku
            }
          }
        `;

        const itemData = await shopifyGraphQL(
          store.shop_domain,
          store.access_token,
          itemQuery
        );

        if (!itemData.inventoryItem) {
          validationReport.errors.push(`inventory_item_id ${inventoryItemAlias.alias_value} not found in Shopify`);
          validationReport.checks.inventory_item_exists_shopify = 'FAIL';
        } else {
          validationReport.checks.inventory_item_exists_shopify = 'PASS';
          validationReport.inventory_item_details = {
            tracked: itemData.inventoryItem.tracked,
            sku: itemData.inventoryItem.sku,
          };

          if (!itemData.inventoryItem.tracked) {
            validationReport.warnings.push('Inventory item is not tracked in Shopify');
          }
        }
      } catch (itemError) {
        validationReport.errors.push(`Failed to validate inventory item: ${itemError.message}`);
        validationReport.checks.inventory_item_exists_shopify = 'ERROR';
      }
    }

    // 9. Fetch current Shopify inventory level (if all mappings valid)
    if (inventoryItemAlias && validationReport.checks.location_exists_shopify === 'PASS') {
      try {
        const inventoryQuery = `
          query {
            inventoryLevel(id: "gid://shopify/InventoryLevel/${inventoryItemAlias.alias_value}?location_id=${client.shopify_location_id}") {
              id
              available
            }
          }
        `;

        const inventoryData = await shopifyGraphQL(
          store.shop_domain,
          store.access_token,
          inventoryQuery
        );

        if (inventoryData.inventoryLevel) {
          validationReport.shopify_inventory = inventoryData.inventoryLevel.available;
          validationReport.checks.shopify_inventory = 'FETCHED';

          // Compare
          const difference = validationReport.shopify_inventory - validationReport.app_inventory;
          if (difference !== 0) {
            validationReport.warnings.push(`Inventory mismatch: App=${validationReport.app_inventory}, Shopify=${validationReport.shopify_inventory}, Difference=${difference}`);
          } else {
            validationReport.checks.inventory_match = 'PASS';
          }
        } else {
          validationReport.warnings.push('Inventory level not found in Shopify');
          validationReport.checks.shopify_inventory = 'NOT_FOUND';
        }
      } catch (inventoryError) {
        validationReport.warnings.push(`Failed to fetch Shopify inventory: ${inventoryError.message}`);
        validationReport.checks.shopify_inventory = 'ERROR';
      }
    }

    // Final assessment
    const hasErrors = validationReport.errors.length > 0;
    const hasWarnings = validationReport.warnings.length > 0;

    validationReport.overall_status = hasErrors ? 'FAIL' : hasWarnings ? 'WARN' : 'PASS';

    return new Response(
      JSON.stringify({
        success: !hasErrors,
        validation: validationReport,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: hasErrors ? 400 : 200 }
    );

  } catch (error) {
    console.error('[SKU Validation] Fatal error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
