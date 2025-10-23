import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

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

    const { client_id } = await req.json();

    // Get client info
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('id', client_id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    // Get store credentials
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .single();

    if (!store) {
      throw new Error('Store not found or inactive');
    }

    // Get inventory items that need syncing
    const { data: inventoryItems } = await supabase
      .from('inventory_sync')
      .select('*')
      .eq('client_id', client_id)
      .eq('sync_enabled', true);

    if (!inventoryItems || inventoryItems.length === 0) {
      return new Response(
        JSON.stringify({ success: true, synced: 0, message: 'No items enabled for sync' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    let synced = 0;
    const errors = [];

    for (const item of inventoryItems) {
      try {
        // Update inventory level in Shopify
        const response = await fetch(
          `https://${store.shop_domain}/admin/api/2024-01/inventory_levels/set.json`,
          {
            method: 'POST',
            headers: {
              'X-Shopify-Access-Token': store.access_token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location_id: item.location_id, // This would need to be stored in inventory_sync
              inventory_item_id: item.sku,
              available: item.westfield_quantity,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to update ${item.sku}: ${response.statusText}`);
        }

        // Update last synced timestamp
        await supabase
          .from('inventory_sync')
          .update({
            last_synced_at: new Date().toISOString(),
            shopify_quantity: item.westfield_quantity,
          })
          .eq('id', item.id);

        synced++;
      } catch (error) {
        console.error(`Error syncing ${item.sku}:`, error);
        errors.push({ sku: item.sku, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced,
        total: inventoryItems.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Inventory sync error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Unable to sync inventory with Shopify. Please try again or contact support.' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
