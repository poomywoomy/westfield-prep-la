import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting QC photo cleanup job...');

    // Calculate cutoff date (30 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const cutoffISO = cutoffDate.toISOString();

    console.log(`Cutoff date: ${cutoffISO}`);

    // Get photos older than 30 days from qc_images table
    const { data: oldPhotos, error: queryError } = await supabase
      .from('qc_images')
      .select('id, file_path, created_at')
      .lt('created_at', cutoffISO);

    if (queryError) {
      console.error('Error querying old photos:', queryError);
      throw queryError;
    }

    if (!oldPhotos || oldPhotos.length === 0) {
      console.log('No old photos to delete');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No photos older than 30 days found',
          deleted: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${oldPhotos.length} photos to delete`);

    let deletedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Delete each photo from storage and database
    for (const photo of oldPhotos) {
      try {
        // Delete from storage bucket
        const { error: storageError } = await supabase.storage
          .from('qc-images')
          .remove([photo.file_path]);

        if (storageError) {
          console.error(`Failed to delete storage file ${photo.file_path}:`, storageError);
          errors.push(`Storage: ${photo.file_path} - ${storageError.message}`);
          failedCount++;
          continue;
        }

        // Delete from database
        const { error: dbError } = await supabase
          .from('qc_images')
          .delete()
          .eq('id', photo.id);

        if (dbError) {
          console.error(`Failed to delete database record ${photo.id}:`, dbError);
          errors.push(`Database: ${photo.id} - ${dbError.message}`);
          failedCount++;
          continue;
        }

        deletedCount++;
        console.log(`✓ Deleted photo ${photo.file_path} (${photo.created_at})`);
      } catch (error: any) {
        console.error(`Unexpected error deleting photo ${photo.id}:`, error);
        errors.push(`Unexpected: ${photo.id} - ${error.message}`);
        failedCount++;
      }
    }

    const result = {
      success: true,
      message: `Cleanup completed: ${deletedCount} photos deleted, ${failedCount} failed`,
      deleted: deletedCount,
      failed: failedCount,
      errors: errors.length > 0 ? errors : undefined
    };

    console.log('Cleanup job completed:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Critical error in cleanup job:', error);
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
});
