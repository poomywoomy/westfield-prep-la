import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Allowlist of legitimate rate limit key prefixes to prevent probing
const ALLOWED_KEY_PREFIXES = [
  'login_',
  'password_reset_',
  'contact_form_',
  'intake_form_',
];

const rateLimitSchema = z.object({
  key: z.string().max(100),
  maxAttempts: z.number().int().positive().max(100),
  windowMinutes: z.number().int().positive().max(1440), // Max 24 hours
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const validationResult = rateLimitSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { key, maxAttempts, windowMinutes } = validationResult.data;
    
    // Validate key prefix against allowlist to prevent probing
    const hasValidPrefix = ALLOWED_KEY_PREFIXES.some(prefix => key.startsWith(prefix));
    if (!hasValidPrefix) {
      return new Response(
        JSON.stringify({ error: "Invalid rate limit key" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get client IP for additional tracking
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `${key}_${clientIp}`;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Calculate window start time
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
    
    // Check existing rate limit entries
    const { data: existing, error: fetchError } = await supabase
      .from("rate_limits")
      .select("id, request_count")
      .eq("rate_key", rateLimitKey)
      .gte("window_start", windowStart.toISOString())
      .order("window_start", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      if (Deno.env.get("ENVIRONMENT") === "development") {
        console.error("Error fetching rate limit:", fetchError);
      }
      // Fail closed - deny request when rate limit service unavailable
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          remaining: 0,
          error: 'Rate limit service unavailable. Please try again later.',
          retryAfter: 60
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existing) {
      const currentCount = existing.request_count || 0;
      
      if (currentCount >= maxAttempts) {
        return new Response(
          JSON.stringify({ 
            allowed: false, 
            remaining: 0,
            retryAfter: windowMinutes * 60
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Increment existing record
      await supabase
        .from("rate_limits")
        .update({ request_count: currentCount + 1 })
        .eq("id", existing.id);

      return new Response(
        JSON.stringify({ 
          allowed: true, 
          remaining: maxAttempts - currentCount - 1 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new rate limit record
    await supabase
      .from("rate_limits")
      .insert({
        rate_key: rateLimitKey,
        window_start: now.toISOString(),
        request_count: 1,
      });

    return new Response(
      JSON.stringify({ 
        allowed: true, 
        remaining: maxAttempts - 1 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    if (Deno.env.get("ENVIRONMENT") === "development") {
      console.error("Error in check-rate-limit function:", error);
    }
    // Fail closed - deny request on error
    return new Response(
      JSON.stringify({ 
        allowed: false, 
        remaining: 0,
        error: 'Rate limit service error. Please try again later.',
        retryAfter: 60
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
