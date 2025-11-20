import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { shopifyGraphQL } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const APPROVE_RETURN_MUTATION = `
  mutation returnApproveRequest($id: ID!) {
    returnApproveRequest(input: { id: $id }) {
      return {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DECLINE_RETURN_MUTATION = `
  mutation returnDeclineRequest($id: ID!, $declineReason: ReturnDeclineReason) {
    returnDeclineRequest(input: { 
      id: $id,
      declineReason: $declineReason
    }) {
      return {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CLOSE_RETURN_MUTATION = `
  mutation returnClose($id: ID!) {
    returnClose(input: { id: $id }) {
      return {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Process Shopify return actions using GraphQL
 * All operations use GraphQL mutations - zero REST API calls
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

    // Convert to Shopify GID format
    const returnGid = `gid://shopify/Return/${return_id}`;

    // Execute GraphQL mutation based on action
    let mutationResult;
    let mutationKey;

    if (action === 'approve') {
      mutationResult = await shopifyGraphQL(
        store.shop_domain,
        store.access_token,
        APPROVE_RETURN_MUTATION,
        { id: returnGid }
      );
      mutationKey = 'returnApproveRequest';
    } else if (action === 'decline') {
      mutationResult = await shopifyGraphQL(
        store.shop_domain,
        store.access_token,
        DECLINE_RETURN_MUTATION,
        { id: returnGid, declineReason: 'OTHER' }
      );
      mutationKey = 'returnDeclineRequest';
    } else if (action === 'mark_as_received' || action === 'mark_received') {
      mutationResult = await shopifyGraphQL(
        store.shop_domain,
        store.access_token,
        CLOSE_RETURN_MUTATION,
        { id: returnGid }
      );
      mutationKey = 'returnClose';
    } else {
      throw new Error(`Invalid action: ${action}`);
    }

    // Check for GraphQL userErrors
    if (mutationResult[mutationKey]?.userErrors?.length > 0) {
      const errors = mutationResult[mutationKey].userErrors.map((e: any) => e.message).join(', ');
      throw new Error(`Shopify GraphQL error: ${errors}`);
    }

    console.log(`Return ${return_id} ${action} completed via GraphQL for client ${client_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        action,
        status: mutationResult[mutationKey]?.return?.status 
      }),
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
