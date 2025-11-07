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

    // Verify user is authenticated and is admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify admin role
    const { data: role } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!role || role.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { client_id, delete_products = false } = await req.json();

    if (!client_id) {
      throw new Error('client_id is required');
    }

    // Get store info before disconnecting
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('client_id', client_id)
      .single();

    if (!store) {
      throw new Error('Store not found');
    }

    // Deactivate the store
    await supabase
      .from('shopify_stores')
      .update({ is_active: false })
      .eq('client_id', client_id);

    // Disable auto-sync
    await supabase
      .from('shopify_sync_config')
      .update({ auto_sync_enabled: false })
      .eq('client_id', client_id);

    // Delete webhooks from Shopify
    try {
      const { data: webhooks } = await supabase
        .from('shopify_webhooks')
        .select('webhook_id')
        .eq('client_id', client_id);

      if (webhooks && webhooks.length > 0) {
        for (const webhook of webhooks) {
          await fetch(
            `https://${store.shop_domain}/admin/api/2024-07/webhooks/${webhook.webhook_id}.json`,
            {
              method: 'DELETE',
              headers: {
                'X-Shopify-Access-Token': store.access_token,
                'Content-Type': 'application/json',
              },
            }
          );
        }

        // Delete webhook records from database
        await supabase
          .from('shopify_webhooks')
          .delete()
          .eq('client_id', client_id);
      }
    } catch (error) {
      console.error('Error deleting webhooks:', error);
      // Continue even if webhook deletion fails
    }

    // Optionally delete synced products
    if (delete_products) {
      await supabase
        .from('client_skus')
        .delete()
        .eq('client_id', client_id);
    }

    // Log the action
    await supabase.from('audit_log').insert({
      user_id: user.id,
      action: 'DISCONNECT_STORE',
      table_name: 'shopify_stores',
      record_id: client_id,
      old_data: store,
      new_data: { delete_products },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Store disconnected successfully',
        products_deleted: delete_products,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Disconnect store error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Unable to disconnect Shopify store. Please try again or contact support.' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
