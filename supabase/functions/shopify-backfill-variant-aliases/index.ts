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

    console.log('Starting variant_id alias backfill...');

    // Get all SKUs that have shopify_inventory_item_id but missing shopify_variant_id
    const { data: skusWithInventoryAlias } = await supabase
      .from('sku_aliases')
      .select('sku_id, alias_value')
      .eq('alias_type', 'shopify_inventory_item_id');

    if (!skusWithInventoryAlias || skusWithInventoryAlias.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No inventory aliases found', backfilled: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${skusWithInventoryAlias.length} SKUs with inventory_item_id aliases`);

    // Check which ones already have variant_id aliases
    const { data: existingVariantAliases } = await supabase
      .from('sku_aliases')
      .select('sku_id')
      .eq('alias_type', 'shopify_variant_id');

    const skusWithVariantAlias = new Set(existingVariantAliases?.map(a => a.sku_id) || []);

    // Filter to only SKUs missing variant_id
    const skusNeedingVariantAlias = skusWithInventoryAlias.filter(
      alias => !skusWithVariantAlias.has(alias.sku_id)
    );

    console.log(`${skusNeedingVariantAlias.length} SKUs need variant_id aliases`);

    if (skusNeedingVariantAlias.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'All SKUs already have variant_id aliases', 
          backfilled: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract variant_id from SKU notes field (fallback strategy)
    const aliasesToInsert = [];

    for (const alias of skusNeedingVariantAlias) {
      const { data: sku } = await supabase
        .from('skus')
        .select('id, notes, client_id')
        .eq('id', alias.sku_id)
        .single();

      if (!sku?.notes) continue;

      // Parse "Variant ID: 123456" from notes
      const variantIdMatch = sku.notes.match(/Variant ID: (\d+)/);
      
      if (variantIdMatch) {
        const variantId = variantIdMatch[1];
        aliasesToInsert.push({
          sku_id: sku.id,
          alias_type: 'shopify_variant_id',
          alias_value: variantId,
        });
      }
    }

    console.log(`Extracted ${aliasesToInsert.length} variant_ids from SKU notes`);

    // Insert missing aliases
    if (aliasesToInsert.length > 0) {
      const { error } = await supabase
        .from('sku_aliases')
        .upsert(aliasesToInsert, {
          onConflict: 'sku_id,alias_type,alias_value',
        });

      if (error) {
        console.error('Error inserting aliases:', error);
        throw error;
      }
    }

    console.log(`✓ Successfully backfilled ${aliasesToInsert.length} variant_id aliases`);

    return new Response(
      JSON.stringify({
        success: true,
        backfilled: aliasesToInsert.length,
        total_checked: skusWithInventoryAlias.length,
        message: `Backfilled ${aliasesToInsert.length} missing variant_id aliases`,
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
