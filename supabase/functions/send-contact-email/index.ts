import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  business: string;
  volume: string;
  recipientEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, business, volume, recipientEmail }: ContactEmailRequest = await req.json();

    console.log("Sending contact form email to:", recipientEmail);

    // Send notification email to business
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Westfield 3PL <info@westfieldprepcenter.com>",
        to: [recipientEmail],
        reply_to: email,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Business:</strong> ${business}</p>
          <p><strong>Monthly Volume & Requirements:</strong></p>
          <p>${volume}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">You can reply directly to this email to respond to ${name}</p>
        `,
      }),
    });

    const data = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Business notification email sent successfully:", data);

    // Send confirmation email to the submitter
    const confirmationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Westfield 3PL <info@westfieldprepcenter.com>",
        to: [email],
        reply_to: "info@westfieldprepcenter.com",
        subject: "We've Received Your Contact Request",
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
                        <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 40px; text-align: center;">
                          <a href="https://westfieldprepcenter.com" style="display: inline-block;">
                            <img src="https://westfieldprepcenter.com/westfield-logo.png" alt="Westfield 3PL" style="max-width: 200px; height: auto;">
                          </a>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <h1 style="color: #0F172A; margin: 0 0 20px 0; font-size: 28px; font-weight: 700;">Thank You for Reaching Out!</h1>
                          
                          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Hi ${name},
                          </p>
                          
                          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            We've successfully received your contact request and our team will review your requirements shortly. We'll get back to you within 1-2 business days with your custom pricing sheet and next steps for onboarding.
                          </p>
                          
                          <div style="background-color: #f8fafc; border-left: 4px solid #F97316; padding: 20px; margin: 30px 0; border-radius: 4px;">
                            <h2 style="color: #0F172A; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Your Submission Details:</h2>
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Name:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${name}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Email:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${email}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Phone:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${phone}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Business:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${business}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0; vertical-align: top;">Requirements:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${volume}</td>
                              </tr>
                            </table>
                          </div>
                          
                          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            <strong>Need to add something?</strong> Simply reply to this email directly and we'll make sure your additional information is included in your quote.
                          </p>
                          
                          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
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
                          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                            This email was sent in response to your contact form submission.
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

    const confirmationData = await confirmationResponse.json();

    if (!confirmationResponse.ok) {
      console.error("Confirmation email error:", confirmationData);
      // Don't throw here - business notification already sent
      console.log("Business was notified but confirmation email failed");
    } else {
      console.log("Confirmation email sent successfully:", confirmationData);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
