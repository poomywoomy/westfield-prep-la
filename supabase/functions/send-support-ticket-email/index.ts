import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sanitizeString } from '../_shared/input-sanitizer.ts';
import { checkRateLimit, validateHoneypot } from '../_shared/security-utils.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    
    // Rate limiting: 3 support tickets per hour per IP
    const rateLimitKey = `support_ticket:${clientIp}`;
    const rateLimit = await checkRateLimit(supabaseUrl, supabaseServiceKey, rateLimitKey, 3, 60);
    
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many support ticket submissions. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize all inputs to prevent XSS
    const rawData = await req.json();
    
    // Honeypot validation
    if (!validateHoneypot(rawData.honeypot)) {
      console.warn('Honeypot triggered for support ticket:', clientIp);
      // Return success to avoid revealing detection
      return new Response(
        JSON.stringify({ success: true, message: "Support ticket received" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    const sanitizedData = {
      ticket_id: sanitizeString(rawData.ticket_id),
      client_id: rawData.client_id, // UUID, no sanitization needed
      issue_category: sanitizeString(rawData.issue_category),
      issue_description: sanitizeString(rawData.issue_description),
      preferred_contact_method: sanitizeString(rawData.preferred_contact_method),
      contact_email: rawData.contact_email ? sanitizeString(rawData.contact_email) : undefined,
      contact_phone: rawData.contact_phone ? sanitizeString(rawData.contact_phone) : undefined,
    };
    
    const {
      ticket_id,
      client_id,
      issue_category,
      issue_description,
      preferred_contact_method,
      contact_email,
      contact_phone,
    } = sanitizedData;

    // Get client details using REST API
    const clientResponse = await fetch(
      `${supabaseUrl}/rest/v1/clients?id=eq.${client_id}&select=company_name,contact_name,email`,
      {
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    const clients = await clientResponse.json();
    const client = clients[0];

    if (!client) {
      throw new Error("Client not found");
    }

    // Prepare email content
    const contactInfo =
      preferred_contact_method === "email"
        ? `Email: ${contact_email}`
        : `Phone: ${contact_phone}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Support Ticket</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <h2 style="color: #ea580c; margin-top: 0;">🎫 New Support Ticket</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <p><strong>Ticket ID:</strong> ${ticket_id}</p>
              <p><strong>Client:</strong> ${client.company_name} (${client.contact_name})</p>
              <p><strong>Client Email:</strong> ${client.email}</p>
              <p><strong>Issue Category:</strong> <span style="background-color: #fef3c7; padding: 2px 8px; border-radius: 4px;">${issue_category}</span></p>
              <p><strong>Preferred Contact Method:</strong> ${preferred_contact_method}</p>
              <p><strong>Contact Info:</strong> ${contactInfo}</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 6px;">
              <h3 style="margin-top: 0; color: #1f2937;">Issue Description:</h3>
              <p style="white-space: pre-wrap;">${issue_description}</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <p style="font-size: 14px; color: #6b7280;">Please respond to this ticket promptly to maintain customer satisfaction.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Westfield Prep Center <notifications@westfieldprepcenter.com>",
        to: ["info@westfieldprepcenter.com"],
        subject: `[Support Ticket] ${issue_category} - ${client.company_name}`,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const result = await resendResponse.json();
    console.log("Support ticket email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, message: "Support ticket email sent" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error sending support ticket email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);
