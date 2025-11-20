import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

export async function handleReturnWebhook(
  supabase: SupabaseClient,
  clientId: string,
  topic: string,
  data: any
) {
  const returnId = data.id?.toString();
  const orderId = data.order_id?.toString();
  
  // Extract line items and calculate expected qty
  const rawLineItems = data.return_line_items || [];
  const expectedQty = rawLineItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  
  // Map Shopify variants to local SKUs
  const enrichedLineItems = await Promise.all(
    rawLineItems.map(async (item: any) => {
      const variantId = item.line_item?.variant_id?.toString();
      const shopifySku = item.line_item?.sku;
      
      let skuId = null;
      let skuMatched = false;
      let clientSku = null;
      let title = null;
      let imageUrl = null;

      // Try to find SKU by variant_id in sku_aliases
      if (variantId) {
        const { data: aliasData } = await supabase
          .from('sku_aliases')
          .select('sku_id, skus!inner(client_sku, title, image_url, client_id)')
          .eq('alias_type', 'shopify_variant_id')
          .eq('alias_value', variantId)
          .eq('skus.client_id', clientId)
          .maybeSingle();

        if (aliasData) {
          skuId = aliasData.sku_id;
          clientSku = (aliasData.skus as any)?.client_sku;
          title = (aliasData.skus as any)?.title;
          imageUrl = (aliasData.skus as any)?.image_url;
          skuMatched = true;
        }
      }

      // Fallback: Try to match by client_sku
      if (!skuMatched && shopifySku) {
        const { data: skuData } = await supabase
          .from('skus')
          .select('id, client_sku, title, image_url')
          .eq('client_id', clientId)
          .eq('client_sku', shopifySku)
          .maybeSingle();

        if (skuData) {
          skuId = skuData.id;
          clientSku = skuData.client_sku;
          title = skuData.title;
          imageUrl = skuData.image_url;
          skuMatched = true;
        }
      }

      if (!skuMatched) {
        console.warn(`Return webhook: Could not map Shopify variant ${variantId} or SKU ${shopifySku} to local SKU`);
      }

      return {
        ...item,
        variant_id: variantId,
        sku: shopifySku,
        sku_id: skuId,
        sku_matched: skuMatched,
        client_sku: clientSku,
        title: title || item.line_item?.title,
        image_url: imageUrl,
      };
    })
  );
  
  // Check if return already fully processed (idempotency)
  const { data: existingReturn } = await supabase
    .from('shopify_returns')
    .select('id, status')
    .eq('client_id', clientId)
    .eq('shopify_return_id', returnId)
    .maybeSingle();

  if (existingReturn) {
    console.log(`Return ${returnId} already exists with status ${existingReturn.status}`);
    
    // Determine new status
    const newStatus = topic.includes('request') ? 'requested' : 
                      topic.includes('approve') ? 'approved' : 
                      topic.includes('decline') ? 'declined' : 'requested';
    
    // Only update status if it changed, don't re-upsert line items
    if (existingReturn.status !== newStatus) {
      await supabase
        .from('shopify_returns')
        .update({
          status: newStatus,
          synced_at: new Date().toISOString(),
        })
        .eq('id', existingReturn.id);
      
      console.log(`Updated return ${returnId} status to ${newStatus}`);
    }
    
    return; // Skip re-inserting
  }

  console.log(`Creating new return record: ${returnId}`);

  const returnData = {
    client_id: clientId,
    shopify_return_id: returnId,
    shopify_order_id: orderId,
    order_number: data.order_number || data.name,
    status: topic.includes('request') ? 'requested' : 
            topic.includes('approve') ? 'approved' : 
            topic.includes('decline') ? 'declined' : 'requested',
    return_reason: data.return_reason || rawLineItems[0]?.return_reason || null,
    line_items: enrichedLineItems,
    expected_qty: expectedQty,
    created_at_shopify: data.created_at,
  };
  
  const { error } = await supabase
    .from('shopify_returns')
    .upsert(returnData, {
      onConflict: 'client_id,shopify_return_id',
    });
  
  if (error) {
    console.error('Error upserting return:', error);
    throw error;
  }
  
  console.log(`Return webhook processed: ${returnId} - Status: ${returnData.status}`);
}
