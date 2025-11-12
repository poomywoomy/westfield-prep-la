import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const welcomeEmailSchema = z.object({
  email: z.string().email().max(255),
  tempPassword: z.string().min(8).max(100),
  redirectUrl: z.string().url().max(500),
});

interface WelcomeEmailRequest {
  email: string;
  tempPassword: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = welcomeEmailSchema.safeParse(body);
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
    
    const { email, tempPassword, redirectUrl }: WelcomeEmailRequest = validationResult.data;

    const homeUrl = redirectUrl.split('/login')[0] || redirectUrl;

    console.log(`Sending welcome email to ${email}`);

    // Send branded welcome email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Westfield 3PL <info@westfieldprepcenter.com>",
        to: [email],
        subject: "Welcome to Westfield 3PL - Temporary Password Enclosed",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Westfield 3PL</title>
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
                            Welcome to Westfield 3PL
                          </h1>
                          
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4a5568;">
                            Your client account has been successfully created! Below is your temporary password to access your dashboard.
                          </p>
                          
                          <!-- Temporary Password Box -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                            <tr>
                              <td style="padding: 20px; background-color: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">
                                  Temporary Password
                                </p>
                                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1a1f2e; font-family: 'Courier New', monospace; letter-spacing: 1px;">
                                  ${tempPassword}
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                          <div style="padding: 20px; background-color: #fee2e2; border-left: 4px solid #ef4444; border-radius: 4px; margin: 20px 0;">
                            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #991b1b;">
                              ⚠️ IMPORTANT SECURITY NOTICE
                            </p>
                            <p style="margin: 10px 0 0 0; font-size: 14px; line-height: 1.6; color: #7f1d1d;">
                              This temporary password is valid for <strong>24 hours only</strong>. Please log in immediately and change your password to secure your account.
                            </p>
                          </div>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                            <tr>
                              <td align="center">
                                <a href="${redirectUrl}" style="display: inline-block; padding: 16px 40px; background-color: #ff8000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(255,128,0,0.3);">
                                  Log In to Your Dashboard
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.6; color: #718096;">
                            <strong>Next Steps:</strong>
                          </p>
                          <ol style="margin: 10px 0 0 20px; padding: 0; font-size: 14px; line-height: 1.8; color: #4a5568;">
                            <li>Click the button above to access the login page</li>
                            <li>Enter your email and the temporary password provided</li>
                            <li><strong>Immediately change your password</strong> after logging in</li>
                          </ol>
                          
                          <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.6; color: #718096;">
                            If you have any questions or need assistance, please don't hesitate to contact our support team.
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
                          <p style="margin: 10px 0 0 0; font-size: 12px; color: #a0aec0; text-align: center;">
                            1801 Flower Ave Office 2, Duarte, CA 91010
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
      console.error("Email delivery failed:", emailData);
      throw new Error("Email service error");
    }

    console.log("Welcome email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Welcome email sent successfully"
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
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send welcome email"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
