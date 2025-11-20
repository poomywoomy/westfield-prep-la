import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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

    const { client_id } = await req.json();

    // Use service client for RLS-free access
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get client and store info
    const { data: client } = await serviceClient
      .from('clients')
      .select('shopify_location_id')
      .eq('id', client_id)
      .single();

    if (!client?.shopify_location_id) {
      throw new Error('No Shopify location configured for this client. Run location sync first.');
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

    // Get all SKU aliases with inventory item IDs
    const { data: aliases } = await serviceClient
      .from('sku_aliases')
      .select(`
        alias_value,
        skus!inner(client_id)
      `)
      .eq('alias_type', 'shopify_inventory_item_id')
      .eq('skus.client_id', client_id);

    const inventoryItemIds = aliases?.map(a => a.alias_value) || [];
    
    console.log(`Activating ${inventoryItemIds.length} inventory items at location ${client.shopify_location_id}`);

    // Activate inventory items at this location
    const activationMutation = `
      mutation inventoryActivate($inventoryItemId: ID!, $locationId: ID!) {
        inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId) {
          inventoryLevel {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    let activatedCount = 0;
    const errors = [];

    for (const itemId of inventoryItemIds) {
      try {
        const result = await shopifyGraphQL(
          store.shop_domain,
          store.access_token,
          activationMutation,
          {
            inventoryItemId: `gid://shopify/InventoryItem/${itemId}`,
            locationId: `gid://shopify/Location/${client.shopify_location_id}`
          }
        );

        if (result.inventoryActivate.userErrors.length === 0) {
          activatedCount++;
        } else {
          const errorMsg = result.inventoryActivate.userErrors[0].message;
          // Ignore "already active" errors
          if (!errorMsg.includes('already active')) {
            errors.push({ itemId, error: errorMsg });
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        errors.push({ itemId, error: errorMessage });
      }

      // Rate limiting pause
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    // Audit log
    await serviceClient.from('audit_log').insert({
      user_id: user.id,
      action: 'ACTIVATE_LOCATION_INVENTORY',
      table_name: 'shopify_stores',
      record_id: client_id,
      new_data: { activated: activatedCount, total: inventoryItemIds.length, errors_count: errors.length }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        activated: activatedCount,
        total: inventoryItemIds.length,
        errors: errors.slice(0, 10)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Activation error:', error);
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
