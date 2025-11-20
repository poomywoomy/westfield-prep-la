import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { requireAuth } from '../_shared/auth-middleware.ts';
import { sanitizeError } from '../../../src/lib/errorHandler.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication (JWT verified by Supabase)
    const { user, supabase } = await requireAuth(req);
    
    const { shop } = await req.json();

    console.log('Starting OAuth flow for shop:', shop, 'User:', user.id);

    if (!shop) {
      console.error('No shop domain provided');
      return new Response(
        JSON.stringify({ error: 'Shop domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize frontend origin against allowlist
    const allowedOrigins = [
      Deno.env.get('FRONTEND_URL'),
      'http://localhost:5173',
      'http://localhost:8080',
      '.lovableproject.com',
    ];
    
    const referer = req.headers.get('Referer') || req.headers.get('Origin') || '';
    let origin = '';
    
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        const isAllowed = allowedOrigins.some(allowed => 
          allowed && (refererUrl.origin === allowed || refererUrl.hostname.endsWith(allowed))
        );
        
        if (isAllowed) {
          origin = refererUrl.origin;
          console.log('Validated frontend origin:', origin);
        } else {
          console.warn('Unrecognized origin:', refererUrl.origin);
        }
      } catch (e) {
        console.error('Invalid referer URL:', e);
      }
    }

    const clientId = Deno.env.get('SHOPIFY_CLIENT_ID');
    const apiVersion = Deno.env.get('SHOPIFY_API_VERSION') || '2024-07';
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/shopify-oauth-callback`;
    
    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);
    
    const scopes = 'read_products,write_products,read_orders,write_orders,read_inventory,write_inventory,read_locations,write_locations,read_third_party_fulfillment_orders,write_third_party_fulfillment_orders,read_returns,write_returns,read_shipping,write_shipping';
    
    // Generate secure state parameter and store it
    const state = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    const { error: stateError } = await supabase
      .from('oauth_states')
      .insert({
        state,
        user_id: user.id,
        expires_at: expiresAt.toISOString(),
        frontend_origin: origin
      });
    
    if (stateError) {
      console.error('Failed to store OAuth state:', stateError);
      return new Response(
        JSON.stringify({ error: 'Failed to initialize OAuth flow' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build OAuth URL without grant_options to avoid installation link errors
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    
    console.log('Generated OAuth URL with state:', state);
    console.log('Full OAuth URL:', authUrl);

    return new Response(
      JSON.stringify({ authUrl, state }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error starting OAuth:', error);
    
    // Return generic error message to client
    const statusCode = error.message?.includes('Authentication') ? 401 : 
                       error.message?.includes('required') ? 400 : 500;
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to start OAuth flow' }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
