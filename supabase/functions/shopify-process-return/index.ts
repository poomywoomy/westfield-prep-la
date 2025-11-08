import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { guardedShopifyREST } from '../_shared/shopify-rest-guard.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Process Shopify return actions
 * Note: Returns API has limited GraphQL support. Using REST with guard to prevent
 * deprecated products/variants endpoints. All REST calls are logged for monitoring.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { client_id, return_id, action } = await req.json();
    // action: 'approve', 'decline', 'mark_received'

    // Get store credentials
    const { data: store } = await supabase
      .from('shopify_stores')
      .select('shop_domain, access_token')
      .eq('client_id', client_id)
      .eq('is_active', true)
      .single();

    if (!store) throw new Error('Store not found');

    // Construct endpoint based on action
    const endpoint = action === 'approve' 
      ? `/returns/${return_id}/approve.json`
      : action === 'decline'
      ? `/returns/${return_id}/decline.json`
      : `/returns/${return_id}/mark_as_received.json`;

    // Use guarded REST call - blocks products/variants endpoints
    const response = await guardedShopifyREST(
      store.shop_domain,
      store.access_token,
      endpoint,
      { method: 'POST' }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update return status: ${errorText}`);
    }

    console.log(`Return ${return_id} ${action} for client ${client_id}`);

    return new Response(
      JSON.stringify({ success: true, action }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Return processing error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to process return' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
