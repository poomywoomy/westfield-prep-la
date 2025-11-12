import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const createClientSchema = z.object({
  email: z.string().email().max(255),
  company_name: z.string().trim().min(1).max(200),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  phone_number: z.string().trim().min(1).max(20),
  estimated_units_per_month: z.number().int().positive().nullable(),
  receiving_format: z.string().max(100),
  extra_prep: z.boolean(),
  storage: z.boolean(),
  storage_units_per_month: z.number().int().positive().nullable(),
  storage_method: z.string().max(100).nullable(),
  admin_notes: z.string().max(2000),
  fulfillment_services: z.array(z.string()),
});

interface CreateClientRequest {
  email: string;
  company_name: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  estimated_units_per_month: number | null;
  receiving_format: string;
  extra_prep: boolean;
  storage: boolean;
  storage_units_per_month: number | null;
  storage_method: string | null;
  admin_notes: string;
  fulfillment_services: string[];
}

// Generate secure temporary password
function generatePassword(): string {
  const length = 16;
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
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

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === requestData.email);

    let userId: string;
    let isNewUser = false;

    let tempPassword: string | null = null;

    if (existingUser) {
      userId = existingUser.id;
      console.log(`Updating existing user: ${userId}`);
    } else {
      // Generate secure temporary password for new user
      tempPassword = generatePassword();
      console.log(`Creating new user with temporary password (expires in 24 hours)`);

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: requestData.email,
        password: tempPassword,
        email_confirm: true,
      });

      if (authError || !authData.user) {
        console.error("Failed to create auth user:", authError);
        throw authError || new Error("Failed to create user");
      }

      userId = authData.user.id;
      isNewUser = true;
      console.log(`New auth user created: ${userId}`);
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
      throw profileError;
    }

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
      throw roleError;
    }

    // Calculate password expiration (24 hours from now)
    const passwordExpiresAt = isNewUser 
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      : null;

    console.log("Creating/updating client with data:", {
      user_id: userId,
      company_name: requestData.company_name,
      storage: requestData.storage,
      storage_method: requestData.storage_method,
      storage_units_per_month: requestData.storage_units_per_month,
      is_new_user: isNewUser,
      password_expires_at: passwordExpiresAt,
    });

    const clientPayload = {
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
      storage_method: requestData.storage_method,
      admin_notes: requestData.admin_notes,
      fulfillment_services: requestData.fulfillment_services,
      status: 'pending',
      password_expires_at: passwordExpiresAt,
    };

    console.log("About to upsert client with payload:", JSON.stringify(clientPayload, null, 2));

    const { data: clientData, error: clientError } = await supabaseAdmin
      .from("clients")
      .upsert(clientPayload, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (clientError) {
      console.error("Client upsert error - Full details:", {
        message: clientError.message,
        details: clientError.details,
        hint: clientError.hint,
        code: clientError.code,
      });
      throw new Error(`Failed to create client record: ${clientError.message}`);
    }

    console.log("Client record created/updated successfully:", clientData?.id);

    // For new users, send welcome email with temporary password
    if (isNewUser && tempPassword) {
      try {
        const origin = req.headers.get('origin') || Deno.env.get("SUPABASE_URL") || "";
        const loginUrl = `${origin}/login`;
        
        console.log(`Sending welcome email to ${requestData.email} with login URL: ${loginUrl}`);
        
        const { error: emailError } = await supabaseAdmin.functions.invoke('send-welcome-email', {
          body: {
            email: requestData.email,
            tempPassword: tempPassword,
            redirectUrl: loginUrl,
          },
        });

        if (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't fail the whole operation if email fails
        } else {
          console.log("Welcome email sent successfully");
        }
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the whole operation if email fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: existingUser 
          ? "Client account updated successfully" 
          : "Client account created successfully. Welcome email with temporary 24-hour password sent to client.",
        user_id: userId,
        is_new_user: isNewUser
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Create client error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unable to create client account. Please try again or contact support.",
        details: error.details || undefined,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
