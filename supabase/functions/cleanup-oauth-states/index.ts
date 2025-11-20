import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Starting OAuth states cleanup...');

    // Call the database function to cleanup expired states
    const { data, error } = await supabase.rpc('cleanup_old_oauth_states');

    if (error) {
      console.error('Error cleaning up OAuth states:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('OAuth states cleanup completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'OAuth states cleanup completed'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in cleanup-oauth-states:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Scheduled job: Run daily at 3 AM
Deno.cron('Cleanup OAuth States', '0 3 * * *', async () => {
  console.log('Running scheduled OAuth states cleanup...');
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const { error } = await supabase.rpc('cleanup_old_oauth_states');
    
    if (error) {
      console.error('Scheduled cleanup failed:', error);
    } else {
      console.log('Scheduled cleanup completed successfully');
    }
  } catch (error) {
    console.error('Scheduled cleanup error:', error);
  }
});
