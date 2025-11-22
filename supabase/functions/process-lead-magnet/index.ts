import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const leadMagnetSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters")
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse and validate request body
    const body = await req.json();
    const validationResult = leadMagnetSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Validation failed", 
          details: validationResult.error.issues 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { fullName, email } = validationResult.data;

    // Check if email already downloaded recently (within last hour to prevent spam)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentDownload } = await supabase
      .from("lead_magnet_downloads")
      .select("id")
      .eq("email", email)
      .gte("created_at", oneHourAgo)
      .single();

    if (recentDownload) {
      return new Response(
        JSON.stringify({ 
          error: "You've already downloaded this guide recently. Please check your email." 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Store lead in database
    const { error: dbError } = await supabase
      .from("lead_magnet_downloads")
      .insert({
        email,
        full_name: fullName,
        guide_type: "fulfillment_partner_guide"
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store lead information");
    }

    // Get PDF URL from storage (assuming it's pre-uploaded)
    const { data: pdfData } = await supabase.storage
      .from("blog-images")
      .createSignedUrl("fulfillment-partner-guide.pdf", 604800); // 7 days

    const pdfUrl = pdfData?.signedUrl || "https://westfieldprepcenter.com/guide";

    // Send email to user with PDF
    const userEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0A66C2 0%, #064A8C 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .button { display: inline-block; background: #0A66C2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
    .checklist { background: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .checklist-item { padding: 8px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Your Fulfillment Partner Guide is Ready! 📦</h1>
    </div>
    
    <div class="content">
      <p>Hi ${fullName},</p>
      
      <p>Thank you for downloading <strong>"The Complete Guide to Choosing a Fulfillment Partner"</strong>!</p>
      
      <p>This comprehensive 50+ page guide covers everything you need to know before outsourcing your e-commerce logistics, including:</p>
      
      <div class="checklist">
        <div class="checklist-item">✓ 15 questions to ask before signing with any 3PL</div>
        <div class="checklist-item">✓ How to decode pricing models and avoid hidden fees</div>
        <div class="checklist-item">✓ Red flags that save you from bad partnerships</div>
        <div class="checklist-item">✓ Performance metrics to track after launch</div>
        <div class="checklist-item">✓ Your complete fulfillment partner evaluation checklist</div>
      </div>
      
      <center>
        <a href="${pdfUrl}" class="button">Download Your Free Guide</a>
      </center>
      
      <p><strong>What's Next?</strong></p>
      
      <p>Over the next two weeks, I'll send you additional insights on choosing the right fulfillment partner, including real-world case studies and cost calculators.</p>
      
      <p>In the meantime, if you have any questions about your fulfillment needs, feel free to reply to this email. I'm here to help!</p>
      
      <p>Best regards,<br>
      <strong>The Westfield Prep Center Team</strong><br>
      Los Angeles's Premier E-Commerce Fulfillment Partner</p>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #64748b;">
        <strong>P.S.</strong> Ready to see how we can help your business? <a href="https://westfieldprepcenter.com/contact" style="color: #0A66C2;">Schedule a free fulfillment audit</a> and we'll show you exactly where you can save time and money.
      </p>
    </div>
    
    <div class="footer">
      <p>© 2025 Westfield Prep Center. All rights reserved.</p>
      <p>1801 Flower Ave Office 2, Duarte, CA 91010</p>
      <p style="margin-top: 10px;">
        <a href="https://westfieldprepcenter.com" style="color: #0A66C2; margin: 0 10px;">Website</a> | 
        <a href="mailto:hello@westfieldprepcenter.com" style="color: #0A66C2; margin: 0 10px;">Contact</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email to user with PDF using Resend API
    const userEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Westfield Prep Center <info@westfieldprepcenter.com>",
        to: [email],
        subject: "Your Complete Fulfillment Partner Guide is Ready 📦",
        html: userEmailHtml,
      }),
    });

    if (!userEmailResponse.ok) {
      const errorData = await userEmailResponse.text();
      console.error("User email error:", userEmailResponse.status, errorData);
      // Don't fail the request if email fails - lead is already stored
    } else {
      console.log("User email sent successfully to:", email);
    }

    // Send notification to admin
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0A66C2; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .info-box { background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .label { font-weight: bold; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">🎯 New Lead Magnet Download</h2>
    </div>
    
    <div class="content">
      <p>A new lead has downloaded the Fulfillment Partner Guide:</p>
      
      <div class="info-box">
        <p><span class="label">Name:</span> ${fullName}</p>
        <p><span class="label">Email:</span> ${email}</p>
        <p><span class="label">Guide:</span> Complete Fulfillment Partner Guide</p>
        <p><span class="label">Downloaded:</span> ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT</p>
      </div>
      
      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Lead has been added to the database</li>
        <li>Welcome email sequence started</li>
        <li>Follow up in 2-3 days if interested</li>
      </ul>
    </div>
  </div>
</body>
</html>
    `;

    // Send notification to admin using Resend API
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Westfield Leads <info@westfieldprepcenter.com>",
        to: ["info@westfieldprepcenter.com"],
        subject: `New Lead: ${fullName} downloaded Fulfillment Guide`,
        html: adminEmailHtml,
      }),
    });

    if (!adminEmailResponse.ok) {
      const errorData = await adminEmailResponse.text();
      console.error("Admin notification error:", adminEmailResponse.status, errorData);
    } else {
      console.log("Admin notification sent successfully");
    }

    console.log(`Lead magnet processed successfully for ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Guide sent! Check your email." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error processing lead magnet:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
