import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('🧹 Starting webhook cleanup job...');

    // Delete processed webhooks older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { error, count } = await supabase
      .from('processed_webhooks')
      .delete({ count: 'exact' })
      .lt('processed_at', thirtyDaysAgo);

    if (error) {
      console.error('❌ Cleanup error:', error);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ Cleaned up ${count || 0} old webhook records`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Cleaned up ${count || 0} webhook records`,
        deleted_count: count || 0,
      }), 
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
