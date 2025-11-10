import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roles?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all Shopify stores
    const { data: stores, error: storesError } = await supabase
      .from("shopify_stores")
      .select("id, client_id");

    if (storesError) throw storesError;

    if (!stores || stores.length === 0) {
      return new Response(
        JSON.stringify({ message: "No Shopify stores found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enable auto-sync for all stores (preserve existing sync frequencies)
    const configRecords = await Promise.all(stores.map(async (store) => {
      const { data: existing } = await supabase
        .from('shopify_sync_config')
        .select('sync_frequency')
        .eq('client_id', store.client_id)
        .maybeSingle();

      const frequency = existing?.sync_frequency || '5min';
      
      // Calculate next sync time based on frequency
      const frequencyMinutes: Record<string, number> = {
        '5min': 5,
        '10min': 10,
        'hourly': 60,
        'daily': 1440,
        'weekly': 10080,
      };
      const minutes = frequencyMinutes[frequency] || 5;

      return {
        client_id: store.client_id,
        auto_sync_enabled: true,
        sync_frequency: frequency,
        next_sync_at: new Date(Date.now() + minutes * 60 * 1000).toISOString(),
      };
    }));

    // Upsert sync configs
    const { error: upsertError } = await supabase
      .from("shopify_sync_config")
      .upsert(configRecords, {
        onConflict: "client_id",
      });

    if (upsertError) throw upsertError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Auto-sync enabled for ${stores.length} store(s)`,
        stores_updated: stores.length
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error enabling auto-sync:", error);
    let errorMessage = 'Failed to enable auto-sync';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
