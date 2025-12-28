import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const roiReportSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  useCase: z.string(),
  businessStage: z.string(),
  currentFulfillment: z.string(),
  productType: z.string(),
  monthlyOrders: z.number(),
  avgUnitsPerOrder: z.number(),
  skuCount: z.number(),
  currentErrorRate: z.number(),
  returnRate: z.number(),
  hoursSpentWeekly: z.number(),
  painPoints: z.array(z.string()),
  services: z.array(z.string()),
  specialRequirements: z.array(z.string()),
  fbaDtcSplit: z.number().optional(),
  // FBA/WFS specific fields
  unitsRequiringPrep: z.number().optional(),
  fnskuPolybagUnits: z.number().optional(),
  bundlingOrders: z.number().optional(),
  bubbleWrapUnits: z.number().optional(),
  // Calculated results
  roi: z.object({
    monthlyUnits: z.number(),
    totalSavings: z.number(),
    annualSavings: z.number(),
    timeSavedHours: z.number(),
    currentErrorCost: z.number(),
    returnCost: z.number(),
    estimatedMonthlyCost: z.number(),
    costPerUnit: z.string(),
    roiPercent: z.number(),
    fbaPrepCost: z.number().optional(),
  }),
});

const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    console.log("Received ROI report request:", { email: body.email, fullName: body.fullName });
    
    const validationResult = roiReportSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.issues);
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validationResult.error.issues }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = validationResult.data;
    const safeFullName = escapeHtml(data.fullName);
    const safeCompanyName = data.companyName ? escapeHtml(data.companyName) : '';

    // Store in database with full calculator data
    const { error: dbError } = await supabase
      .from("lead_magnet_downloads")
      .insert({
        email: data.email,
        full_name: data.fullName,
        guide_type: "enhanced_roi_calculator_v1.2",
      });

    if (dbError) {
      console.error("Database error:", dbError);
    }

    // Label mappings for human-readable output
    const useCaseLabels: Record<string, string> = {
      'shopify': 'Shopify / DTC',
      'amazon': 'Amazon FBA',
      'multi-channel': 'Multi-Channel',
      'b2b': 'B2B / Wholesale',
    };

    const businessStageLabels: Record<string, string> = {
      'startup': 'Just Starting (<$50K/year)',
      'growing': 'Growing ($50K-$500K/year)',
      'established': 'Established ($500K-$2M/year)',
      'scaling': 'Scaling Fast ($2M+/year)',
    };

    const serviceLabels: Record<string, string> = {
      'receiving': 'Receiving & Inspection',
      'storage': 'Storage & Warehousing',
      'fba-prep': 'Amazon FBA Prep',
      'pick-pack': 'Pick & Pack',
      'labeling': 'Labeling & Compliance',
      'kitting': 'Kitting & Bundling',
      'returns': 'Returns Processing',
    };

    const servicesFormatted = data.services.map(s => serviceLabels[s] || s).join(', ') || 'None selected';

    // Label mappings for currentFulfillment
    const currentFulfillmentLabels: Record<string, string> = {
      'self': 'Self-Fulfilled',
      'other-3pl': 'Using Another 3PL',
      'hybrid': 'Hybrid (Self + 3PL)',
    };

    // Label mappings for pain points
    const painPointLabels: Record<string, string> = {
      'errors': 'High Error Rates',
      'slow': 'Slow Processing',
      'expensive': 'High Costs',
      'scaling': "Can't Scale",
      'visibility': 'No Visibility',
      'support': 'Poor Support',
    };

    const painPointsFormatted = data.painPoints.map(p => painPointLabels[p] || p).join(', ') || 'None selected';
    const currentFulfillmentFormatted = currentFulfillmentLabels[data.currentFulfillment] || data.currentFulfillment;

    // Check if this is an FBA/WFS or Multi-Channel use case
    const isFBAUseCase = data.useCase === 'amazon' || data.useCase === 'multi-channel';
    const hasFBAData = (data.fnskuPolybagUnits || 0) > 0 || (data.bundlingOrders || 0) > 0 || (data.bubbleWrapUnits || 0) > 0;

    // Build FBA section for user email
    const userFBASection = isFBAUseCase && hasFBAData ? `
      <h3 style="color: #0A66C2; margin-top: 30px;">FBA/WFS Prep Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #64748b;">Units Requiring Prep:</td><td style="font-weight: bold;">${(data.unitsRequiringPrep || 0).toLocaleString()}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">FNSKU + Polybag Units:</td><td style="font-weight: bold;">${(data.fnskuPolybagUnits || 0).toLocaleString()}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Bundling Units:</td><td style="font-weight: bold;">${(data.bundlingOrders || 0).toLocaleString()}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Bubble Wrap Units:</td><td style="font-weight: bold;">${(data.bubbleWrapUnits || 0).toLocaleString()}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Estimated Prep Cost:</td><td style="font-weight: bold; color: #F97316;">$${(data.roi.fbaPrepCost || 0).toLocaleString()}/mo</td></tr>
      </table>
    ` : '';

    // Determine ROI color based on positive/negative
    const roiColor = data.roi.roiPercent >= 0 ? '#22c55e' : '#ef4444';
    const roiSign = data.roi.roiPercent >= 0 ? '+' : '';

    // User email - Premium redesigned template
    const userEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f8fafc;
    }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { 
      background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .logo-container {
      background: white;
      display: inline-block;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .content { background: #ffffff; padding: 40px 30px; }
    
    /* Hero Savings Box */
    .hero-savings {
      background: linear-gradient(135deg, #22c55e15 0%, #22c55e08 100%);
      border: 2px solid #22c55e40;
      border-radius: 20px;
      padding: 35px 25px;
      margin: 30px 0;
      text-align: center;
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.12);
    }
    .hero-savings-label { 
      font-size: 14px; 
      color: #64748b; 
      text-transform: uppercase; 
      letter-spacing: 1px;
      font-weight: 600;
    }
    .hero-savings-value { 
      font-size: 52px; 
      font-weight: 800; 
      color: #22c55e; 
      margin: 12px 0;
      line-height: 1.1;
    }
    .hero-savings-sublabel { 
      font-size: 13px; 
      color: #94a3b8; 
    }
    
    /* ROI Badge */
    .roi-badge {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 20px;
      font-weight: 700;
      margin-top: 15px;
    }
    
    /* Stats Grid */
    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 16px; 
      margin: 25px 0; 
    }
    .stat-box { 
      background: #f8fafc; 
      border: 1px solid #e2e8f0;
      border-radius: 16px; 
      padding: 20px; 
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .stat-value { 
      font-size: 28px; 
      font-weight: 700; 
      color: #0A66C2; 
    }
    .stat-label { 
      font-size: 12px; 
      color: #64748b; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    
    /* Section Cards */
    .section-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .section-heading {
      font-size: 16px;
      font-weight: 700;
      color: #0A66C2;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-table {
      width: 100%;
      border-collapse: collapse;
    }
    .section-table td {
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .section-table tr:last-child td {
      border-bottom: none;
    }
    .section-table td:first-child {
      color: #64748b;
    }
    .section-table td:last-child {
      font-weight: 600;
      text-align: right;
    }
    
    /* CTA Button */
    .cta-button {
      display: block;
      width: 100%;
      background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
      color: white;
      padding: 18px 32px;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 17px;
      text-align: center;
      box-shadow: 0 4px 14px rgba(249, 115, 22, 0.35);
      margin: 30px 0;
    }
    
    /* Promo Banner */
    .promo-banner {
      background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%);
      border-left: 4px solid #F97316;
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 12px 12px 0;
    }
    .promo-banner p {
      margin: 0;
      font-size: 14px;
      color: #92400e;
    }
    .promo-banner strong {
      color: #78350f;
    }
    
    /* Footer */
    .footer { 
      background: #1e293b; 
      color: #94a3b8; 
      padding: 30px; 
      text-align: center; 
      font-size: 13px; 
    }
    .footer a { 
      color: #F97316; 
      text-decoration: none;
    }
    .footer-links {
      margin-top: 15px;
    }
    .footer-links a {
      margin: 0 12px;
    }
    
    /* Mobile Responsive */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 25px 20px !important; }
      .header { padding: 30px 20px !important; }
      .hero-savings-value { font-size: 42px !important; }
      .stats-grid { grid-template-columns: 1fr !important; }
      .stat-value { font-size: 24px !important; }
      .section-card { padding: 18px !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header with Logo -->
    <div class="header">
      <div class="logo-container">
        <a href="https://westfieldprepcenter.com" target="_blank" style="display: inline-block;">
          <img 
            src="https://westfieldprepcenter.com/westfield-logo.png" 
            alt="Westfield Prep Center" 
            style="max-width: 200px; height: auto; display: block;"
          />
        </a>
      </div>
      <h1 style="margin: 0; font-size: 28px; font-weight: 800;">Your Savings Report is Ready</h1>
      <p style="margin: 12px 0 0; opacity: 0.9; font-size: 16px;">Based on your selections, here's what we've calculated</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 5px;">Hi ${safeFullName},</p>
      <p style="color: #64748b; font-size: 15px; margin-top: 0;">Thank you for using our 3PL Savings Calculator! Here's your personalized estimate:</p>
      
      <!-- Hero Savings Box -->
      <div class="hero-savings">
        <div class="hero-savings-label">Estimated Monthly Savings</div>
        <div class="hero-savings-value">$${data.roi.totalSavings.toLocaleString()}</div>
        <div class="hero-savings-sublabel">Based on ${data.roi.monthlyUnits.toLocaleString()} units/month</div>
        <div class="roi-badge" style="background: ${roiColor}20; color: ${roiColor};">
          ${roiSign}${data.roi.roiPercent}% ROI
        </div>
      </div>
      
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">$${data.roi.annualSavings.toLocaleString()}</div>
          <div class="stat-label">Annual Savings</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${data.roi.timeSavedHours}h</div>
          <div class="stat-label">Hours Saved/Month</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color: ${roiColor};">${roiSign}${data.roi.roiPercent}%</div>
          <div class="stat-label">Return on Investment</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color: #F97316;">${isFBAUseCase && data.roi.fbaPrepCost ? '$' + data.roi.fbaPrepCost.toLocaleString() : '$' + data.roi.costPerUnit}</div>
          <div class="stat-label">${isFBAUseCase && data.roi.fbaPrepCost ? 'Est. Prep Cost' : 'Est. Cost/Unit'}</div>
        </div>
      </div>

      <!-- Current Fulfillment Section -->
      <div class="section-card">
        <h3 class="section-heading">📊 Current Fulfillment Method</h3>
        <table class="section-table">
          <tr><td>Use Case</td><td>${useCaseLabels[data.useCase] || data.useCase}</td></tr>
          <tr><td>Business Stage</td><td>${businessStageLabels[data.businessStage] || data.businessStage}</td></tr>
          <tr><td>Current Fulfillment</td><td>${currentFulfillmentFormatted}</td></tr>
        </table>
      </div>

      <!-- Pain Points Section -->
      <div class="section-card">
        <h3 class="section-heading">⚠️ Key Pain Points</h3>
        <table class="section-table">
          <tr><td>Pain Points</td><td>${painPointsFormatted}</td></tr>
          <tr><td>Current Error Rate</td><td>${data.currentErrorRate}%</td></tr>
          <tr><td>Return Rate</td><td>${data.returnRate}%</td></tr>
        </table>
      </div>

      <!-- Monthly Order Details -->
      <div class="section-card">
        <h3 class="section-heading">📦 Monthly Order Details</h3>
        <table class="section-table">
          <tr><td>Monthly Units</td><td>${data.roi.monthlyUnits.toLocaleString()}</td></tr>
          <tr><td>Monthly Orders</td><td>${data.monthlyOrders.toLocaleString()}</td></tr>
          <tr><td>SKU Count</td><td>${data.skuCount}</td></tr>
          <tr><td>Services Needed</td><td>${servicesFormatted}</td></tr>
        </table>
      </div>

      <!-- ROI & Cost Breakdown -->
      <div class="section-card" style="background: linear-gradient(135deg, #22c55e08 0%, #22c55e03 100%); border-color: #22c55e30;">
        <h3 class="section-heading" style="color: #22c55e;">💰 Estimated ROI & Cost Breakdown</h3>
        <table class="section-table">
          <tr><td>Monthly Savings</td><td style="color: #22c55e; font-size: 18px;">$${data.roi.totalSavings.toLocaleString()}</td></tr>
          <tr><td>Annual Savings</td><td style="color: #22c55e;">$${data.roi.annualSavings.toLocaleString()}</td></tr>
          <tr><td>Error Cost Eliminated</td><td>$${data.roi.currentErrorCost.toLocaleString()}</td></tr>
          <tr><td>Time Saved</td><td>${data.roi.timeSavedHours} hours/month</td></tr>
        </table>
      </div>
      
      ${userFBASection}
      
      <!-- CTA Button -->
      <a href="https://calendly.com/westfieldprepcenter/30min" class="cta-button" target="_blank">
        Schedule a Call →
      </a>
      
      <!-- Promo Banner -->
      <div class="promo-banner">
        <p><strong>💡 Looking for even greater savings?</strong></p>
        <p style="margin-top: 8px;">You're likely eligible for additional per-unit discounts as your volume scales. Let's explore a custom quote for you.</p>
      </div>
      
      <h3 style="color: #0A66C2; margin-top: 30px; font-size: 18px; font-weight: 700;">What's Next?</h3>
      <ol style="padding-left: 20px; color: #475569;">
        <li style="margin-bottom: 12px;">A fulfillment specialist will contact you within 24 hours</li>
        <li style="margin-bottom: 12px;">We'll review your specific requirements and provide a detailed quote</li>
        <li style="margin-bottom: 12px;">No obligation – just honest answers to help you decide</li>
      </ol>
      
      <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
        Have questions? Reply to this email or call us at <strong style="color: #333;">(818) 935-5478</strong>.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">© 2025 Westfield Prep Center. Los Angeles, CA</p>
      <div class="footer-links">
        <a href="https://westfieldprepcenter.com">Website</a>
        <a href="mailto:info@westfieldprepcenter.com">Contact</a>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Admin notification email
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { background: #F97316; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 25px; border: 1px solid #e5e7eb; border-top: none; }
    .section { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }
    .value { font-size: 16px; margin-top: 3px; }
    .highlight { background: linear-gradient(135deg, #22c55e15 0%, #22c55e05 100%); border-left: 4px solid #22c55e; padding: 15px; margin: 15px 0; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .metric { text-align: center; padding: 15px; background: #f1f5f9; border-radius: 6px; }
    .metric-val { font-size: 24px; font-weight: bold; color: #0A66C2; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">New High-Intent Lead from ROI Calculator</h2>
    </div>
    
    <div class="content">
      <div class="highlight">
        <div class="label">Lead Quality Score: HIGH</div>
        <div class="value" style="font-size: 20px; color: #22c55e; font-weight: bold;">Completed full 6-step calculator</div>
      </div>
      
      <h3 style="color: #0A66C2; border-bottom: 2px solid #0A66C2; padding-bottom: 8px;">Contact Information</h3>
      <div class="section">
        <div class="grid">
          <div>
            <div class="label">Name</div>
            <div class="value">${safeFullName}</div>
          </div>
          <div>
            <div class="label">Company</div>
            <div class="value">${safeCompanyName || 'Not provided'}</div>
          </div>
          <div>
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div>
            <div class="label">Phone</div>
            <div class="value">${data.phone || 'Not provided'}</div>
          </div>
        </div>
      </div>
      
      <h3 style="color: #0A66C2; border-bottom: 2px solid #0A66C2; padding-bottom: 8px;">Business Profile</h3>
      <div class="section">
        <div class="grid">
          <div>
            <div class="label">Use Case</div>
            <div class="value">${useCaseLabels[data.useCase] || data.useCase}</div>
          </div>
          <div>
            <div class="label">Business Stage</div>
            <div class="value">${businessStageLabels[data.businessStage] || data.businessStage}</div>
          </div>
          <div>
            <div class="label">Current Fulfillment</div>
            <div class="value">${currentFulfillmentFormatted}</div>
          </div>
          <div>
            <div class="label">Product Type</div>
            <div class="value">${data.productType}</div>
          </div>
        </div>
      </div>
      
      <h3 style="color: #0A66C2; border-bottom: 2px solid #0A66C2; padding-bottom: 8px;">Volume & Metrics</h3>
      <div class="section">
        <div class="grid">
          <div class="metric">
            <div class="metric-val">${data.monthlyOrders.toLocaleString()}</div>
            <div class="label">Monthly Orders</div>
          </div>
          <div class="metric">
            <div class="metric-val">${data.roi.monthlyUnits.toLocaleString()}</div>
            <div class="label">Monthly Units</div>
          </div>
          <div class="metric">
            <div class="metric-val">${data.skuCount}</div>
            <div class="label">SKU Count</div>
          </div>
          <div class="metric">
            <div class="metric-val">${data.avgUnitsPerOrder}</div>
            <div class="label">Units/Order</div>
          </div>
        </div>
      </div>
      
      <h3 style="color: #0A66C2; border-bottom: 2px solid #0A66C2; padding-bottom: 8px;">Current Pain Points</h3>
      <div class="section">
        <div class="grid">
          <div>
            <div class="label">Error Rate</div>
            <div class="value">${data.currentErrorRate}%</div>
          </div>
          <div>
            <div class="label">Return Rate</div>
            <div class="value">${data.returnRate}%</div>
          </div>
          <div>
            <div class="label">Weekly Hours on Fulfillment</div>
            <div class="value">${data.hoursSpentWeekly} hours</div>
          </div>
          <div>
            <div class="label">Key Pain Points</div>
            <div class="value">${painPointsFormatted}</div>
          </div>
        </div>
      </div>
      
      <h3 style="color: #0A66C2; border-bottom: 2px solid #0A66C2; padding-bottom: 8px;">Services Requested</h3>
      <div class="section">
        <div class="value">${servicesFormatted}</div>
        ${data.specialRequirements.length > 0 ? `<div style="margin-top: 10px;"><div class="label">Special Requirements</div><div class="value">${data.specialRequirements.join(', ')}</div></div>` : ''}
      </div>
      
      ${isFBAUseCase && hasFBAData ? `
      <h3 style="color: #F97316; border-bottom: 2px solid #F97316; padding-bottom: 8px;">📦 FBA/WFS Prep Details</h3>
      <div class="section" style="background: linear-gradient(135deg, #F9731615 0%, #F9731605 100%);">
        <div class="grid">
          <div class="metric" style="background: white;">
            <div class="metric-val" style="color: #F97316;">${(data.unitsRequiringPrep || 0).toLocaleString()}</div>
            <div class="label">Units Requiring Prep</div>
          </div>
          <div class="metric" style="background: white;">
            <div class="metric-val" style="color: #F97316;">$${(data.roi.fbaPrepCost || 0).toLocaleString()}</div>
            <div class="label">Est. Prep Cost</div>
          </div>
          <div class="metric" style="background: white;">
            <div class="metric-val">${(data.fnskuPolybagUnits || 0).toLocaleString()}</div>
            <div class="label">FNSKU + Polybag</div>
          </div>
          <div class="metric" style="background: white;">
            <div class="metric-val">${(data.bundlingOrders || 0).toLocaleString()}</div>
            <div class="label">Bundling</div>
          </div>
          <div class="metric" style="background: white;">
            <div class="metric-val">${(data.bubbleWrapUnits || 0).toLocaleString()}</div>
            <div class="label">Bubble Wrap</div>
          </div>
        </div>
      </div>
      ` : ''}
      
      <h3 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 8px;">Calculated Savings</h3>
      <div class="section" style="background: linear-gradient(135deg, #22c55e15 0%, #22c55e05 100%);">
        <div class="grid">
          <div class="metric" style="background: white;">
            <div class="metric-val" style="color: #22c55e;">$${data.roi.totalSavings.toLocaleString()}</div>
            <div class="label">Monthly Savings</div>
          </div>
          <div class="metric" style="background: white;">
            <div class="metric-val" style="color: #22c55e;">$${data.roi.annualSavings.toLocaleString()}</div>
            <div class="label">Annual Savings</div>
          </div>
          <div class="metric" style="background: white;">
            <div class="metric-val">${data.roi.roiPercent}%</div>
            <div class="label">ROI</div>
          </div>
          <div class="metric" style="background: white;">
            <div class="metric-val">$${data.roi.estimatedMonthlyCost.toLocaleString()}</div>
            <div class="label">Est. Monthly Cost</div>
          </div>
        </div>
      </div>
      
      <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; font-size: 14px;">
        <strong>⏰ Action Required:</strong> Contact this lead within 24 hours. They completed the full calculator which indicates high intent.
      </p>
      
      <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
        Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send user email with proper subject
    let userEmailFailed = false;
    let adminEmailFailed = false;
    let userEmailError = '';
    let adminEmailError = '';

    const userEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Westfield Prep Center <info@westfieldprepcenter.com>",
        to: [data.email],
        subject: "Your Westfield Prep Center Savings Estimate",
        html: userEmailHtml,
      }),
    });

    if (!userEmailResponse.ok) {
      userEmailFailed = true;
      userEmailError = await userEmailResponse.text();
      console.error("User email error:", userEmailResponse.status, userEmailError);
    } else {
      console.log("User email sent successfully to:", data.email);
    }

    // Send admin notification
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Westfield Leads <info@westfieldprepcenter.com>",
        to: ["info@westfieldprepcenter.com"],
        subject: `New Lead: ${safeFullName} | ${useCaseLabels[data.useCase] || data.useCase} | $${data.roi.totalSavings.toLocaleString()}/mo`,
        html: adminEmailHtml,
      }),
    });

    if (!adminEmailResponse.ok) {
      adminEmailFailed = true;
      adminEmailError = await adminEmailResponse.text();
      console.error("Admin email error:", adminEmailResponse.status, adminEmailError);
    } else {
      console.log("Admin notification sent successfully");
    }

    // Return error if any email failed
    if (userEmailFailed || adminEmailFailed) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email delivery failed",
          failedEmails: {
            user: userEmailFailed ? userEmailError : null,
            admin: adminEmailFailed ? adminEmailError : null
          }
        }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Report sent successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-roi-report:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send report", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
