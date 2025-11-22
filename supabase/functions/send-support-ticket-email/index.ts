import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const adminEmailResponse = await resend.emails.send({
      from: "Westfield Prep Center <hello@westfieldprepcenter.com>",
      to: ["hello@westfieldprepcenter.com"],
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
    });

    if (!adminEmailResponse.id) {
      throw new Error("Failed to send admin notification email");
    }

    // Send confirmation to client
    const clientEmailResponse = await resend.emails.send({
      from: "Westfield Prep Center <hello@westfieldprepcenter.com>",
      to: [email],
      subject: `Support Ticket Received - ${displayIssueType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Contacting Westfield Prep Center</h2>
          
          <p>Hi there,</p>
          
          <p>We've received your support ticket and our team will respond shortly via <strong>${preferredContactMethod.toLowerCase()}</strong>.</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Ticket Details</h3>
            <p><strong>Issue Type:</strong> ${displayIssueType}</p>
            <p><strong>Preferred Contact:</strong> ${preferredContactMethod}</p>
          </div>

          <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0;">Your Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px;">
            <p><strong>What happens next?</strong></p>
            <ul style="line-height: 1.8;">
              <li>Our support team will review your request</li>
              <li>We'll contact you via ${preferredContactMethod.toLowerCase()} within 24 hours</li>
              <li>You can track this ticket in your dashboard</li>
            </ul>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>Westfield Prep Center Team</strong><br>
              Los Angeles, CA
            </p>
          </div>
        </div>
      `,
    });

    if (!clientEmailResponse.id) {
      console.warn("Client confirmation email failed to send");
    }

    console.log("Support ticket emails sent successfully:", {
      adminEmail: adminEmailResponse.id,
      clientEmail: clientEmailResponse.id
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmailId: adminEmailResponse.id,
        clientEmailId: clientEmailResponse.id
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