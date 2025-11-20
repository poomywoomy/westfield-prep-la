import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditLogRequest {
  action: string;
  table_name: string;
  record_id?: string;
  user_id?: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for bypassing RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Validate request body
    const body: AuditLogRequest = await req.json();
    
    if (!body.action || !body.table_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: action and table_name' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get authenticated user ID from JWT
    const authHeader = req.headers.get('Authorization');
    let currentUserId: string | null = null;
    
    if (authHeader) {
      const supabaseUser = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      );
      
      const { data: { user } } = await supabaseUser.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      
      currentUserId = user?.id ?? null;
    }

    // Insert audit log entry using service role
    const { error } = await supabaseAdmin
      .from('audit_log')
      .insert({
        user_id: body.user_id ?? currentUserId,
        action: body.action,
        table_name: body.table_name,
        record_id: body.record_id ?? null,
        old_data: body.old_data ?? null,
        new_data: body.new_data ?? null,
      });

    if (error) {
      console.error('Error inserting audit log:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log audit event' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in log-audit-event function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
