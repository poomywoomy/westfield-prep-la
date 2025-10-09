import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const clientCredentialsSchema = z.object({
  email: z.string().email().max(255),
  companyName: z.string().trim().min(1).max(200),
  contactName: z.string().trim().min(1).max(200),
  tempPassword: z.string().min(8).max(100),
});

interface ClientCredentialsRequest {
  email: string;
  companyName: string;
  contactName: string;
  tempPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = clientCredentialsSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { email, companyName, contactName, tempPassword }: ClientCredentialsRequest = validationResult.data;

    console.log("Sending credentials email to:", email);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Westfield 3PL <info@westfieldprepcenter.com>",
        to: [email],
        reply_to: "info@westfieldprepcenter.com",
        subject: "Welcome to Westfield Prep Center - Your Account Details",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                      <!-- Header with Logo -->
                      <tr>
                        <td style="background: #ffffff; padding: 40px; text-align: center; border-bottom: 3px solid #F97316;">
                          <a href="https://westfieldprepcenter.com" style="display: inline-block;">
                            <img src="https://westfieldprepcenter.com/westfield-logo.png" alt="Westfield 3PL" style="max-width: 200px; height: auto;">
                          </a>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <h1 style="color: #0F172A; margin: 0 0 20px 0; font-size: 28px; font-weight: 700;">Welcome to Westfield Prep Center!</h1>
                          
                          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Hi ${contactName},
                          </p>
                          
                          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Your client account for <strong>${companyName}</strong> has been successfully created! Below are your login credentials to access your client dashboard.
                          </p>
                          
                          <!-- Credentials Box -->
                          <div style="background: linear-gradient(135deg, #0F172A 0%, #1e293b 100%); border-radius: 8px; padding: 30px; margin: 30px 0;">
                            <h2 style="color: #F97316; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; text-align: center;">Your Login Credentials</h2>
                            <table width="100%" cellpadding="12" cellspacing="0">
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Email / Username:</td>
                                <td style="color: #ffffff; font-size: 16px; font-weight: 600; text-align: right;">${email}</td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Temporary Password:</td>
                                <td style="color: #F97316; font-size: 18px; font-weight: 700; text-align: right; letter-spacing: 2px;">${tempPassword}</td>
                              </tr>
                            </table>
                          </div>

                          <!-- Sign In Instructions -->
                          <div style="background-color: #f8fafc; border-left: 4px solid #F97316; padding: 20px; margin: 30px 0; border-radius: 4px;">
                            <h3 style="color: #0F172A; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 How to Sign In</h3>
                            <ol style="color: #334155; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                              <li>Visit our website: <a href="https://westfieldprepcenter.com" style="color: #F97316; text-decoration: none; font-weight: 600;">westfieldprepcenter.com</a></li>
                              <li>Click on the <strong>"Sign In"</strong> link located in the footer section at the bottom of the page</li>
                              <li>Enter your email address and temporary password shown above</li>
                              <li>You'll be prompted to change your password on first login for security</li>
                            </ol>
                          </div>

                          <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 16px; margin: 20px 0;">
                            <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0;">
                              <strong>⚠️ Important:</strong> Your temporary password will expire in 24 hours. Please log in and change your password as soon as possible.
                            </p>
                          </div>
                          
                          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                            If you have any questions or need assistance, please don't hesitate to reach out to our team.
                          </p>

                          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                            Best regards,<br>
                            <strong style="color: #0F172A;">The Westfield 3PL Team</strong>
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                          <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                            Westfield Prep Center | Professional 3PL Services
                          </p>
                          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">
                            Need help? Visit our website or reply to this email
                          </p>
                          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                            <a href="https://westfieldprepcenter.com" style="color: #F97316; text-decoration: none;">westfieldprepcenter.com</a>
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

    const data = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", data);
      throw new Error("Email service error");
    }

    console.log("Client credentials email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending client credentials email:", error);
    return new Response(
      JSON.stringify({ error: "Unable to send credentials email. Please contact support." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
