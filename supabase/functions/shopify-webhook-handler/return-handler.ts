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
  const lineItems = data.return_line_items || [];
  const expectedQty = lineItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  
  const returnData = {
    client_id: clientId,
    shopify_return_id: returnId,
    shopify_order_id: orderId,
    order_number: data.order_number || data.name,
    status: topic.includes('request') ? 'requested' : 
            topic.includes('approve') ? 'approved' : 
            topic.includes('decline') ? 'declined' : 'requested',
    return_reason: data.return_reason || lineItems[0]?.return_reason || null,
    line_items: lineItems,
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
