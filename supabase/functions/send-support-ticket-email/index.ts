import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SupportTicketEmailRequest {
  clientId: string;
  clientName: string;
  email: string;
  phone: string;
  issueType: string;
  preferredContactMethod: string;
  message: string;
  otherIssueText?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      clientId,
      clientName, 
      email, 
      phone, 
      issueType, 
      preferredContactMethod, 
      message,
      otherIssueText 
    }: SupportTicketEmailRequest = await req.json();

    const displayIssueType = issueType === "other" ? otherIssueText : issueType;

    // Send email to admin
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Westfield Prep Center <info@westfieldprepcenter.com>",
        to: ["info@westfieldprepcenter.com"],
        subject: `🎫 Support Ticket: ${displayIssueType} - ${clientName}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Support Ticket</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Client Information</h3>
            <p><strong>Company:</strong> ${clientName}</p>
            <p><strong>Client ID:</strong> ${clientId}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Ticket Details</h3>
            <p><strong>Issue Type:</strong> ${displayIssueType}</p>
            <p><strong>Preferred Contact Method:</strong> ${preferredContactMethod}</p>
          </div>

          <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This is an automated notification from Westfield Prep Center Support System</p>
          </div>
        </div>
      `,
      }),
    });

    const adminEmailData = await adminEmailResponse.json();

    if (!adminEmailResponse.ok || !adminEmailData.id) {
      console.error("Admin email failed:", adminEmailData);
      throw new Error("Failed to send admin notification email");
    }

    // Send confirmation to client
    let clientEmailSent = false;
    let clientEmailId = null;
    
    try {
      const clientEmailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Westfield Prep Center <info@westfieldprepcenter.com>",
          to: [email],
          subject: `Support Ticket Received - ${displayIssueType}`,
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Support Ticket Received</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                      
                      <!-- Header with Logo -->
                      <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%);">
                          <img src="https://westfieldprepcenter.com/westfield-logo.png" alt="Westfield Prep Center" style="height: 60px; width: auto;" />
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1f2e; text-align: center;">
                            Thank You for Contacting Us
                          </h1>

                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4a5568;">
                            We've received your support ticket and our team will respond shortly via <strong style="color: #ff8000;">${preferredContactMethod.toLowerCase()}</strong>.
                          </p>

                          <!-- Ticket Details Box -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                            <tr>
                              <td style="padding: 20px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #1a1f2e;">Your Ticket Details</h3>
                                <p style="margin: 8px 0; font-size: 14px; color: #4a5568;">
                                  <strong>Issue Type:</strong> <span style="color: #ff8000;">${displayIssueType}</span>
                                </p>
                                <p style="margin: 8px 0; font-size: 14px; color: #4a5568;">
                                  <strong>Preferred Contact:</strong> ${preferredContactMethod}
                                </p>
                              </td>
                            </tr>
                          </table>

                          <!-- Message Box -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                            <tr>
                              <td style="padding: 20px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1a1f2e;">Your Message</h3>
                                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4a5568; white-space: pre-wrap;">${message}</p>
                              </td>
                            </tr>
                          </table>

                          <!-- What Happens Next -->
                          <div style="margin: 30px 0;">
                            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #1a1f2e;">What Happens Next?</h3>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0; font-size: 14px; line-height: 1.6; color: #4a5568;">
                                  ✓ Our support team will review your request
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; font-size: 14px; line-height: 1.6; color: #4a5568;">
                                  ✓ We'll contact you via ${preferredContactMethod.toLowerCase()} within 24 hours
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; font-size: 14px; line-height: 1.6; color: #4a5568;">
                                  ✓ You can track this ticket in your dashboard
                                </td>
                              </tr>
                            </table>
                          </div>

                          <!-- Support Info -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; padding: 20px; background-color: #fef3e8; border-radius: 8px; border-left: 4px solid #ff8000;">
                            <tr>
                              <td>
                                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4a5568;">
                                  <strong style="color: #1a1f2e;">Need immediate assistance?</strong><br>
                                  Call us at <span style="color: #ff8000; font-weight: 600;">(555) 123-4567</span> during business hours.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding: 30px 40px; background-color: #f7fafc; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0 0 10px 0; font-size: 14px; color: #4a5568; text-align: center;">
                            Best regards,<br>
                            <strong style="color: #1a1f2e;">Westfield Prep Center Team</strong><br>
                            Los Angeles, CA
                          </p>
                          <p style="margin: 10px 0 0 0; font-size: 12px; color: #a0aec0; text-align: center;">
                            © 2025 Westfield Prep Center. All rights reserved.
                          </p>
                          <p style="margin: 5px 0 0 0; font-size: 12px; color: #a0aec0; text-align: center;">
                            Professional prep center and fulfillment services.
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

      const clientEmailData = await clientEmailResponse.json();

      if (clientEmailResponse.ok && clientEmailData.id) {
        clientEmailSent = true;
        clientEmailId = clientEmailData.id;
        console.log("Client confirmation email sent successfully");
      } else {
        console.warn("Client confirmation email failed:", clientEmailData);
      }
    } catch (clientEmailError) {
      console.error("Client confirmation email failed:", clientEmailError);
    }

    console.log("Support ticket emails processed:", {
      adminEmail: adminEmailData.id,
      clientEmail: clientEmailId,
      adminSent: true,
      clientSent: clientEmailSent
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmailSent: true,
        clientEmailSent,
        adminEmailId: adminEmailData.id,
        clientEmailId
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-support-ticket-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);