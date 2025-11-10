import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * One-time backfill script to create missing shopify_variant_id aliases
 * Run this ONCE after deploying the fix to populate historical data
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Starting paginated variant_id alias backfill...');

    let totalBackfilled = 0;
    let offset = 0;
    const batchSize = 500;
    let hasMore = true;

    while (hasMore) {
      console.log(`Processing batch at offset ${offset}...`);
      
      const { data: aliases, error: fetchError } = await supabase
        .from('sku_aliases')
        .select('sku_id, alias_value, skus!inner(client_id, notes)')
        .eq('alias_type', 'shopify_inventory_item_id')
        .range(offset, offset + batchSize - 1);

      if (fetchError) {
        console.error('Error fetching aliases:', fetchError);
        break;
      }

      if (!aliases || aliases.length === 0) {
        console.log('No more aliases to process');
        break;
      }

      console.log(`Processing ${aliases.length} aliases in this batch`);

      // Batch fetch existing variant_id aliases to avoid N+1 queries
      const skuIds = aliases.map(a => a.sku_id);
      const { data: existingVariants } = await supabase
        .from('sku_aliases')
        .select('sku_id')
        .in('sku_id', skuIds)
        .eq('alias_type', 'shopify_variant_id');

      const existingSet = new Set(existingVariants?.map(v => v.sku_id) || []);

      // Find missing variant_id aliases
      const aliasesToBackfill = [];
      
      for (const alias of aliases) {
        // Skip if variant_id alias already exists
        if (existingSet.has(alias.sku_id)) {
          continue;
        }

        // Extract variant_id from notes
        const notes = (alias.skus as any)?.notes || '';
        const variantMatch = notes.match(/Variant ID:\s*(\d+)/i);
        
        if (variantMatch) {
          const variantId = variantMatch[1];
          aliasesToBackfill.push({
            sku_id: alias.sku_id,
            alias_type: 'shopify_variant_id',
            alias_value: variantId,
          });
        }
      }

      // Bulk insert this batch
      if (aliasesToBackfill.length > 0) {
        const { error: insertError } = await supabase
          .from('sku_aliases')
          .upsert(aliasesToBackfill, {
            onConflict: 'sku_id,alias_type,alias_value',
            ignoreDuplicates: true,
          });

        if (insertError) {
          console.error('Batch insert error:', insertError);
        } else {
          totalBackfilled += aliasesToBackfill.length;
          console.log(`✓ Backfilled ${aliasesToBackfill.length} aliases in this batch`);
        }
      }

      // Check if we should continue
      hasMore = aliases.length === batchSize;
      offset += batchSize;
    }

    console.log(`Backfill complete: ${totalBackfilled} total aliases created`);

    return new Response(
      JSON.stringify({
        success: true,
        backfilled: totalBackfilled,
        message: `Backfilled ${totalBackfilled} missing variant_id aliases`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Backfill error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
