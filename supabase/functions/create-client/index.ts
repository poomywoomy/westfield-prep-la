import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateClientRequest {
  email: string;
  tempPassword: string;
  company_name: string;
  contact_name: string;
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
    const requestData: CreateClientRequest = await req.json();
    console.log("Creating client for email:", requestData.email);

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
        full_name: requestData.contact_name,
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

    // Upsert client record
    const { error: clientError } = await supabaseAdmin
      .from("clients")
      .upsert({
        user_id: userId,
        company_name: requestData.company_name,
        contact_name: requestData.contact_name,
        email: requestData.email,
        phone_number: requestData.phone_number,
        estimated_units_per_month: requestData.estimated_units_per_month,
        receiving_format: requestData.receiving_format,
        extra_prep: requestData.extra_prep,
        storage: requestData.storage,
        storage_units_per_month: requestData.storage_units_per_month,
        admin_notes: requestData.admin_notes,
        fulfillment_services: requestData.fulfillment_services,
        temp_password: requestData.tempPassword,
        password_expires_at: requestData.password_expires_at,
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
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
