import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { sanitizeString } from "../_shared/input-sanitizer.ts";
import { isDisposableEmail, validateHoneypot } from "../_shared/security-utils.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const contactEmailSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().trim().min(1).max(20),
  business: z.string().trim().min(1).max(200),
  unitsPerMonth: z.string().min(1),
  skuCount: z.string().min(1),
  marketplaces: z.array(z.string()).min(1),
  packagingRequirements: z.string().min(1),
  timeline: z.string().trim().min(1).max(200),
  comments: z.string().trim().max(1000).optional(),
  recipientEmail: z.string().email().max(255),
});

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

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  business: string;
  unitsPerMonth: string;
  skuCount: string;
  marketplaces: string[];
  packagingRequirements: string;
  timeline: string;
  comments?: string;
  recipientEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = contactEmailSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input provided. Please check your information and try again."
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    
    // Sanitize all user inputs to prevent XSS attacks
    const sanitizedData = {
      name: sanitizeString(validationResult.data.name),
      email: sanitizeString(validationResult.data.email),
      phone: sanitizeString(validationResult.data.phone),
      business: sanitizeString(validationResult.data.business),
      unitsPerMonth: sanitizeString(validationResult.data.unitsPerMonth),
      skuCount: sanitizeString(validationResult.data.skuCount),
      marketplaces: validationResult.data.marketplaces.map((m: string) => sanitizeString(m)),
      packagingRequirements: sanitizeString(validationResult.data.packagingRequirements),
      timeline: sanitizeString(validationResult.data.timeline),
      comments: validationResult.data.comments ? sanitizeString(validationResult.data.comments) : undefined,
      recipientEmail: sanitizeString(validationResult.data.recipientEmail)
    };
    
    const { name, email, phone, business, unitsPerMonth, skuCount, marketplaces, packagingRequirements, timeline, comments, recipientEmail } = sanitizedData;
    
    // Honeypot validation (check before rate limiting to avoid wasting resources)
    if (!validateHoneypot(body.honeypot)) {
      console.warn('Honeypot triggered for contact form:', req.headers.get('x-forwarded-for'));
      // Return success to avoid revealing detection
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Thank you for contacting us! We'll get back to you soon."
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Disposable email detection
    if (isDisposableEmail(email)) {
      console.warn('Disposable email detected:', email);
      return new Response(
        JSON.stringify({ 
          error: "Please use a valid business email address. Disposable email addresses are not allowed."
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Rate limiting check (5 submissions per hour per IP)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `contact_form:${clientIp}`;
    const windowStart = new Date(Date.now() - 3600000); // 1 hour ago
    
    const { data: existingAttempts } = await supabase
      .from('rate_limits')
      .select('request_count, window_start')
      .eq('key', rateLimitKey)
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();
    
    if (existingAttempts && existingAttempts.request_count >= 5) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests. Please try again later."
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Update rate limit counter
    await supabase
      .from('rate_limits')
      .upsert({
        key: rateLimitKey,
        request_count: (existingAttempts?.request_count || 0) + 1,
        window_start: existingAttempts ? existingAttempts.window_start : new Date().toISOString()
      });
    
    // Escape HTML to prevent XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeBusiness = escapeHtml(business);
    const safeUnitsPerMonth = escapeHtml(unitsPerMonth);
    const safeSkuCount = escapeHtml(skuCount);
    const safeMarketplaces = marketplaces.map(m => escapeHtml(m)).join(", ");
    const safePackaging = escapeHtml(packagingRequirements);
    const safeTimeline = escapeHtml(timeline);
    const safeComments = comments ? escapeHtml(comments) : "None provided";

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
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Business:</strong> ${safeBusiness}</p>
          <hr>
          <h3>Business Details</h3>
          <p><strong>Units per Month:</strong> ${safeUnitsPerMonth}</p>
          <p><strong>SKU Count:</strong> ${safeSkuCount}</p>
          <p><strong>Marketplaces:</strong> ${safeMarketplaces}</p>
          <p><strong>Packaging Requirements:</strong> ${safePackaging}</p>
          <p><strong>Timeline:</strong> ${safeTimeline}</p>
          <hr>
          <h3>Additional Comments</h3>
          <p>${safeComments}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">You can reply directly to this email to respond to ${safeName}</p>
        `,
      }),
    });

    const data = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Email delivery failed");
      throw new Error("Failed to send email");
    }

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
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Name:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeName}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Email:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeEmail}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Phone:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safePhone}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Business:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeBusiness}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Units/Month:</td>
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
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Packaging:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safePackaging}</td>
                              </tr>
                              <tr>
                                <td style="color: #64748b; font-size: 14px; font-weight: 600; padding: 8px 0;">Timeline:</td>
                                <td style="color: #334155; font-size: 14px; padding: 8px 0;">${safeTimeline}</td>
                              </tr>
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
      console.error("Confirmation email delivery failed");
      // Don't throw here - business notification already sent
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
