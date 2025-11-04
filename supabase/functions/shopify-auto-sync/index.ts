import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncConfig {
  id: string;
  client_id: string;
  auto_sync_enabled: boolean;
  sync_frequency: 'hourly' | 'daily' | 'weekly';
  next_sync_at: string | null;
}

interface ShopifyStore {
  client_id: string;
  shop_domain: string;
  access_token: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const isRetryableError = (error: any): boolean => {
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') return true;
  if (error.status === 429 || error.status === 503 || error.status === 502) return true;
  return false;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function parseLinkHeader(header: string | null): string | null {
  if (!header) return null;
  const nextMatch = header.match(/<([^>]+)>;\s*rel="next"/);
  return nextMatch ? nextMatch[1] : null;
}

async function fetchShopifyProductsWithRetry(
  shopDomain: string,
  accessToken: string,
  attempt = 1
): Promise<any[]> {
  try {
    const allProducts = [];
    let nextPageUrl: string | null = `https://${shopDomain}/admin/api/2024-01/products.json?limit=250`;
    let pageCount = 0;
    
    while (nextPageUrl) {
      pageCount++;
      console.log(`Fetching products page ${pageCount} (attempt ${attempt})...`);
      
      const response = await fetch(nextPageUrl, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw { status: response.status, message: errorText };
      }

      const data = await response.json();
      allProducts.push(...data.products);
      
      // Get next page from Link header
      const linkHeader = response.headers.get('Link');
      nextPageUrl = parseLinkHeader(linkHeader);
      
      // Add delay to respect rate limits
      if (nextPageUrl) {
        await sleep(500);
      }
    }
    
    console.log(`Fetched ${allProducts.length} total products from ${pageCount} pages`);
    return allProducts;
  } catch (error) {
    console.error(`Shopify API error (attempt ${attempt}):`, error);
    
    if (attempt < MAX_RETRIES && isRetryableError(error)) {
      const delay = RETRY_DELAY_MS * attempt;
      console.log(`Retrying after ${delay}ms...`);
      await sleep(delay);
      return fetchShopifyProductsWithRetry(shopDomain, accessToken, attempt + 1);
    }
    
    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting automatic sync check...');

    // Get all clients that need syncing
    const { data: configsToSync, error: configError } = await supabase
      .from('shopify_sync_config')
      .select('*')
      .eq('auto_sync_enabled', true)
      .lte('next_sync_at', new Date().toISOString());

    if (configError) {
      console.error('Error fetching sync configs:', configError);
      throw configError;
    }

    console.log(`Found ${configsToSync?.length || 0} clients to sync`);

    const results = [];

    for (const config of configsToSync || []) {
      try {
        console.log(`Syncing products for client ${config.client_id}`);

        // Create sync log entry
        const { data: logEntry } = await supabase
          .from('sync_logs')
          .insert({
            client_id: config.client_id,
            sync_type: 'automatic',
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        const startTime = Date.now();

        // Get store credentials
        const { data: store, error: storeError } = await supabase
          .from('shopify_stores')
          .select('shop_domain, access_token')
          .eq('client_id', config.client_id)
          .eq('is_active', true)
          .single();

        if (storeError || !store) {
          throw new Error('Store not found or inactive');
        }

        // Fetch products from Shopify with retry logic
        const products = await fetchShopifyProductsWithRetry(
          store.shop_domain,
          store.access_token
        );

        // Process and upsert products to skus table
        const productData = products.flatMap((product: any) =>
          product.variants.map((variant: any) => ({
            client_id: config.client_id,
            client_sku: variant.sku || `SHOP-${product.id}-${variant.id}`,
            title: variant.title !== 'Default Title' 
              ? `${product.title} - ${variant.title}`
              : product.title,
            unit_cost: parseFloat(variant.price) || 0,
            notes: `Shopify Product ID: ${product.id}, Variant ID: ${variant.id}`,
            status: 'active',
          }))
        );

        const { error: upsertError } = await supabase
          .from('skus')
          .upsert(productData, { onConflict: 'client_id,client_sku' });

        if (upsertError) {
          throw upsertError;
        }

        const duration = Date.now() - startTime;

        // Calculate next sync time
        const now = new Date();
        let nextSync = new Date(now);
        switch (config.sync_frequency) {
          case 'hourly':
            nextSync.setHours(now.getHours() + 1);
            break;
          case 'daily':
            nextSync.setDate(now.getDate() + 1);
            break;
          case 'weekly':
            nextSync.setDate(now.getDate() + 7);
            break;
        }

        // Update sync config and log
        await supabase
          .from('shopify_sync_config')
          .update({
            last_sync_at: new Date().toISOString(),
            next_sync_at: nextSync.toISOString(),
            last_sync_status: 'success',
            last_sync_product_count: productData.length,
          })
          .eq('id', config.id);

        if (logEntry) {
          await supabase
            .from('sync_logs')
            .update({
              status: 'success',
              products_synced: productData.length,
              duration_ms: duration,
              completed_at: new Date().toISOString(),
            })
            .eq('id', logEntry.id);
        }

        results.push({
          client_id: config.client_id,
          success: true,
          products: productData.length,
        });

        console.log(`Successfully synced ${productData.length} products for client ${config.client_id}`);
      } catch (error) {
        console.error(`Error syncing client ${config.client_id}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Update config with error status
        await supabase
          .from('shopify_sync_config')
          .update({
            last_sync_status: 'failed',
          })
          .eq('id', config.id);

        // Update log with error
        const { data: failedLog } = await supabase
          .from('sync_logs')
          .select('id')
          .eq('client_id', config.client_id)
          .eq('status', 'in_progress')
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        if (failedLog) {
          await supabase
            .from('sync_logs')
            .update({
              status: 'failed',
              error_message: errorMessage,
              completed_at: new Date().toISOString(),
            })
            .eq('id', failedLog.id);
        }

        results.push({
          client_id: config.client_id,
          success: false,
          error: errorMessage,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Auto-sync error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
