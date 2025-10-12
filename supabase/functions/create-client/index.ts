import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const createClientSchema = z.object({
  email: z.string().email().max(255),
  tempPassword: z.string().min(8).max(100),
  company_name: z.string().trim().min(1).max(200),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  phone_number: z.string().trim().min(1).max(20),
  estimated_units_per_month: z.number().int().positive().nullable(),
  receiving_format: z.string().max(100),
  extra_prep: z.boolean(),
  storage: z.boolean(),
  storage_units_per_month: z.number().int().positive().nullable(),
  admin_notes: z.string().max(2000),
  fulfillment_services: z.array(z.string()),
  password_expires_at: z.string(),
});

interface CreateClientRequest {
  email: string;
  tempPassword: string;
  company_name: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  estimated_units_per_month: number | null;
  receiving_format: string;
  extra_prep: boolean;
  storage: boolean;
  storage_units_per_month: number | null;
  admin_notes: string;
  fulfillment_services: string[];
  password_expires_at: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get authenticated user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if user is admin
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json();
    
    // Validate input
    const validationResult = createClientSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data provided"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const requestData: CreateClientRequest = validationResult.data;
    console.log("Creating client for email:", requestData.email);

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === requestData.email);

    let userId: string;

    if (existingUser) {
      console.log("User already exists, updating password for:", requestData.email);
      userId = existingUser.id;
      
      // Update password for existing user
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: requestData.tempPassword }
      );
      
      if (updateError) {
        console.error("Error updating password:", updateError);
        throw updateError;
      }
    } else {
      // Create new auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: requestData.email,
        password: requestData.tempPassword,
        email_confirm: true,
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }
      if (!authData.user) throw new Error("Failed to create user");

      userId = authData.user.id;
      console.log("User created with ID:", userId);
    }

    // Upsert profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        email: requestData.email,
        first_name: requestData.first_name,
        last_name: requestData.last_name,
        full_name: `${requestData.first_name} ${requestData.last_name}`,
        company_name: requestData.company_name,
        phone_number: requestData.phone_number,
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error("Profile error:", profileError);
      throw profileError;
    }

    console.log("Profile created");

    // Upsert client role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert({
        user_id: userId,
        role: "client",
      }, {
        onConflict: 'user_id,role',
        ignoreDuplicates: true
      });

    if (roleError) {
      console.error("Role error:", roleError);
      throw roleError;
    }

    console.log("Client role assigned");

    // Upsert client record (NOT storing temp_password for security)
    const { error: clientError } = await supabaseAdmin
      .from("clients")
      .upsert({
        user_id: userId,
        company_name: requestData.company_name,
        first_name: requestData.first_name,
        last_name: requestData.last_name,
        contact_name: `${requestData.first_name} ${requestData.last_name}`,
        email: requestData.email,
        phone_number: requestData.phone_number,
        estimated_units_per_month: requestData.estimated_units_per_month,
        receiving_format: requestData.receiving_format,
        extra_prep: requestData.extra_prep,
        storage: requestData.storage,
        storage_units_per_month: requestData.storage_units_per_month,
        admin_notes: requestData.admin_notes,
        fulfillment_services: requestData.fulfillment_services,
        password_expires_at: requestData.password_expires_at,
        status: 'pending',
      }, {
        onConflict: 'user_id'
      });

    if (clientError) {
      console.error("Client record error:", clientError);
      throw clientError;
    }

    console.log("Client record created successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: existingUser ? "Client account updated successfully" : "Client account created successfully",
        user_id: userId 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating client:", error);
    return new Response(
      JSON.stringify({ 
        error: "Unable to create client account. Please try again or contact support."
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
