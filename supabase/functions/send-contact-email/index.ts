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

// Hardcoded recipient — never trust client input for where leads are sent
const RECIPIENT_EMAIL = "info@westfieldprepcenter.com";

const contactEmailSchema = z.object({
  serviceType: z.enum(["3pl", "launchpad", "both"]),
  name: z.string().trim().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().trim().min(1).max(20),
  business: z.string().trim().min(1).max(200),
  unitsPerMonth: z.string().optional(),
  skuCount: z.string().optional(),
  marketplaces: z.array(z.string()).optional(),
  otherMarketplace: z.string().trim().max(200).optional(),
  receivingMethod: z.enum(["cartons", "pallets", "both"]).optional(),
  packagingRequirements: z.enum(["unbranded", "custom", "own"]).optional(),
  timeline: z.string().optional(),
  comments: z.string().trim().min(1).max(1000),
  recipientEmail: z.string().email().max(255).optional(),
});

function formatServiceType(value: string): string {
  const map: Record<string, string> = {
    '3pl': '3PL Services',
    'launchpad': 'Launchpad (Brand Services)',
    'both': '3PL Services + Launchpad',
  };
  return map[value] || value;
}

function formatPackaging(value?: string): string {
  if (!value) return '';
  const map: Record<string, string> = {
    'unbranded': 'Unbranded packaging',
    'custom': 'Custom packaging',
    'own': 'Customer-provided packaging',
  };
  return map[value] || value;
}

function formatReceivingMethod(value?: string): string {
  if (!value) return '';
  const map: Record<string, string> = {
    'cartons': 'Cartons',
    'pallets': 'Pallets',
    'both': 'Both (Cartons & Pallets)',
  };
  return map[value] || value;
}

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Map dropdown values to human-readable labels
function formatUnitsPerMonth(value: string): string {
  const map: Record<string, string> = {
    'just-starting': 'Just Starting',
    '0-1000': '0 – 1,000',
    '1001-5000': '1,001 – 5,000',
    '5001-10000': '5,001 – 10,000',
    '10000+': '10,000+',
  };
  return map[value] || value;
}

function formatTimeline(value: string): string {
  const map: Record<string, string> = {
    'asap': 'ASAP',
    '1-3-months': '1–3 months',
    '3-6-months': '3–6 months',
    '6-12-months': '6–12 months',
    '12-months-plus': '12 months+',
  };
  return map[value] || value;
}

interface ContactEmailRequest {
  serviceType: "3pl" | "launchpad" | "both";
  name: string;
  email: string;
  phone: string;
  business: string;
  unitsPerMonth?: string;
  skuCount?: string;
  marketplaces?: string[];
  otherMarketplace?: string;
  receivingMethod?: "cartons" | "pallets" | "both";
  packagingRequirements?: "unbranded" | "custom" | "own";
  timeline?: string;
  comments: string;
  recipientEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const validationResult = contactEmailSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(
        JSON.stringify({ error: "Invalid input provided. Please check your information and try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { serviceType, name, email, phone, business, unitsPerMonth, skuCount, marketplaces, otherMarketplace, receivingMethod, packagingRequirements, timeline, comments } = validationResult.data;
    // Always send to the hardcoded internal recipient — ignore any client-supplied value
    const recipientEmail = RECIPIENT_EMAIL;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `contact_form:${clientIp}`;
    const windowStart = new Date(Date.now() - 3600000);

    const { data: existingAttempts } = await supabase
      .from('rate_limits')
      .select('request_count, window_start')
      .eq('key', rateLimitKey)
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();

    if (existingAttempts && existingAttempts.request_count >= 5) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabase.from('rate_limits').upsert({
      key: rateLimitKey,
      request_count: (existingAttempts?.request_count || 0) + 1,
      window_start: existingAttempts ? existingAttempts.window_start : new Date().toISOString()
    });

    const safeServiceType = escapeHtml(formatServiceType(serviceType));
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeBusiness = escapeHtml(business);
    const safeComments = escapeHtml(comments);

    const show3PL = serviceType !== "launchpad";

    let safeMarketplaces = "";
    if (show3PL && marketplaces && marketplaces.length > 0) {
      let display = marketplaces.map(m => escapeHtml(m)).join(", ");
      if (marketplaces.includes("Other") && otherMarketplace && otherMarketplace.trim()) {
        display = display.replace("Other", `Other (${escapeHtml(otherMarketplace.trim())})`);
      }
      safeMarketplaces = display;
    }

    const safeUnitsPerMonth = show3PL && unitsPerMonth ? escapeHtml(formatUnitsPerMonth(unitsPerMonth)) : "";
    const safeSkuCount = show3PL && skuCount ? escapeHtml(skuCount) : "";
    const safeReceiving = show3PL ? escapeHtml(formatReceivingMethod(receivingMethod)) : "";
    const safePackaging = show3PL ? escapeHtml(formatPackaging(packagingRequirements)) : "";
    const safeTimeline = show3PL && timeline ? escapeHtml(formatTimeline(timeline)) : "";

    const threePLBlock = show3PL ? `
      <hr>
      <h3>3PL / Fulfillment Details</h3>
      <p><strong>Orders per Month:</strong> ${safeUnitsPerMonth}</p>
      <p><strong>SKU Count:</strong> ${safeSkuCount}</p>
      <p><strong>Marketplaces:</strong> ${safeMarketplaces}</p>
      <p><strong>Receiving Method:</strong> ${safeReceiving}</p>
      <p><strong>Packaging Requirements:</strong> ${safePackaging}</p>
      <p><strong>Timeline:</strong> ${safeTimeline}</p>
    ` : "";

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
        subject: `New ${formatServiceType(serviceType)} Inquiry from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p style="background:#FF7A00;color:#fff;padding:10px 14px;border-radius:6px;display:inline-block;font-weight:600;">
            Service Requested: ${safeServiceType}
          </p>
          <h3>Contact</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Business:</strong> ${safeBusiness}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          ${threePLBlock}
          <hr>
          <h3>Comments</h3>
          <p>${safeComments}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">You can reply directly to this email to respond to ${safeName}</p>
        `,
      }),
    });

    const data = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Admin email delivery failed", {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        resendResponse: data,
        recipient: recipientEmail,
        from: "info@westfieldprepcenter.com",
      });
      throw new Error(`Failed to send email: ${data?.message || data?.name || "unknown error"}`);
    }

    console.log("Admin notification sent", { id: data?.id, to: recipientEmail });

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
                        <td style="background: #ffffff; padding: 40px; text-align: center; border-bottom: 3px solid #F97316;">
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
                            Hi ${safeName},
                          </p>
                          
                          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            We've successfully received your contact request and our team will review your requirements shortly. We'll get back to you within 1-2 business days with your custom pricing sheet and next steps for onboarding.
                          </p>
                          
                          <div style="background-color: #f8fafc; border-left: 4px solid #F97316; padding: 20px; margin: 30px 0; border-radius: 4px;">
                            <h2 style="color: #0F172A; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Your Submission Details:</h2>
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Service Requested:</td>
                                <td style="color: #FF7A00; font-size: 14px; font-weight: 700; padding: 8px 0;">${safeServiceType}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Name:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeName}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Business:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeBusiness}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Email:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeEmail}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Phone:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safePhone}</td>
                              </tr>
                              ${show3PL ? `
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Orders/Month:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeUnitsPerMonth}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">SKU Count:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeSkuCount}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Marketplaces:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeMarketplaces}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Receiving Method:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeReceiving}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Packaging:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safePackaging}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Timeline:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeTimeline}</td>
                              </tr>
                              ` : ''}
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0; vertical-align: top;">Comments:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeComments}</td>
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
      console.error("Confirmation email delivery failed", {
        status: confirmationResponse.status,
        statusText: confirmationResponse.statusText,
        resendResponse: confirmationData,
        recipient: email,
      });
      // Don't throw here - business notification already sent
    } else {
      console.log("Confirmation email sent", { id: confirmationData?.id, to: email });
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
      JSON.stringify({ 
        error: "Unable to send contact email. Please try again or contact support."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
