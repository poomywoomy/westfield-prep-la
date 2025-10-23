import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const passwordResetSchema = z.object({
  email: z.string().email().max(255),
  redirectUrl: z.string().url().max(500),
});

interface PasswordResetRequest {
  email: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = passwordResetSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(
        JSON.stringify({ 
          error: "Unable to process request. Please verify your information and try again."
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const { email, redirectUrl }: PasswordResetRequest = validationResult.data;

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Rate limiting check (5 attempts per hour per email) - prevent spam and email enumeration
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `password_reset:${email}:${clientIp}`;
    const windowStart = new Date(Date.now() - 3600000); // 1 hour ago
    
    const { data: existingAttempts } = await supabaseAdmin
      .from('rate_limits')
      .select('request_count')
      .eq('key', rateLimitKey)
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();
    
    if (existingAttempts && existingAttempts.request_count >= 5) {
      console.warn(`Rate limit exceeded for password reset: ${email}`);
      // Return success message to prevent email enumeration
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "If an account exists with this email, you will receive a password reset link."
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Update rate limit counter
    await supabaseAdmin
      .from('rate_limits')
      .upsert({
        key: rateLimitKey,
        request_count: (existingAttempts?.request_count || 0) + 1,
        window_start: existingAttempts ? existingAttempts.window_start : new Date().toISOString()
      });

    // Generate password reset link using Supabase
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectUrl,
      }
    });

    if (error) {
      console.error("Error generating reset link:", error);
      throw error;
    }

    if (!data.properties?.action_link) {
      throw new Error("Failed to generate reset link");
    }

    const resetLink = data.properties.action_link;

    const homeUrl = redirectUrl.split('/reset-password')[0];

    // Send branded email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Westfield 3PL <info@westfieldprepcenter.com>",
        to: [email],
        subject: "Reset Your Password - Westfield 3PL",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                      <!-- Header with Logo -->
                      <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%);">
                          <a href="${homeUrl}" style="display: inline-block;">
                            <img src="https://westfieldprepcenter.com/westfield-logo.png" alt="Westfield 3PL" style="height: 60px; width: auto;" />
                          </a>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1f2e; text-align: center;">
                            Reset Your Password
                          </h1>
                          
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4a5568;">
                            We received a request to reset your password for your Westfield 3PL account. Click the button below to create a new password:
                          </p>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                            <tr>
                              <td align="center">
                                <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background-color: #ff8000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(255,128,0,0.3);">
                                  Reset Password
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.6; color: #718096;">
                            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                          </p>
                          
                          <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.6; color: #718096;">
                            This link will expire in 1 hour for security reasons.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="padding: 30px 40px; background-color: #f7fafc; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0; font-size: 14px; color: #718096; text-align: center;">
                            © 2025 Westfield 3PL. All rights reserved.
                          </p>
                          <p style="margin: 10px 0 0 0; font-size: 12px; color: #a0aec0; text-align: center;">
                            Professional 3PL fulfillment services for businesses of all sizes.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Email delivery failed");
      throw new Error("Email service error");
    }

    // Always return the same message to prevent email enumeration
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "If an account exists with this email, you will receive a password reset link."
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    // Always return the same message to prevent email enumeration even on errors
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "If an account exists with this email, you will receive a password reset link."
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
