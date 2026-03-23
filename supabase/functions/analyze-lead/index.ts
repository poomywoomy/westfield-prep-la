import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert sales analyst for Westfield Prep Center, a Los Angeles-based fulfillment and prep center.

## ABOUT WESTFIELD PREP CENTER
- **Location**: Los Angeles, CA — strategic proximity to LA/Long Beach ports (largest US port complex)
- **Experience**: 50+ active clients, 2M+ units processed, family-owned
- **Specialties**: Amazon FBA prep, Shopify DTC fulfillment, TikTok Shop fulfillment, multi-channel logistics

## SERVICES & CAPABILITIES
- **FBA Prep**: 24-48 hour turnaround (same-day rush available), FNSKU labeling, poly bagging, bundling, case packing
- **DTC Fulfillment**: Same-day shipping (orders before 12pm PT), pick & pack, branded packaging
- **TikTok Shop**: 6-hour average processing, 48-hour SLA guaranteed, 10x surge capacity
- **Kitting & Bundling**: 1-3 day turnaround, no minimums, subscription boxes, PR boxes, multi-SKU assembly
- **Returns Processing**: 5-hour inspection turnaround, QC photography, restocking or disposal
- **Receiving & Inspection**: 4-hour average processing, ASN-based workflow, photo documentation
- **Storage**: Climate-controlled (72°F), 24/7 surveillance, lot tracking, pallet or shelf storage
- **Labeling & Compliance**: FNSKU, Prop 65, FDA, UPC relabeling, 1-2 day turnaround
- **Inventory Management**: Real-time dashboard, Shopify sync, barcode scanning, low-stock alerts

## PRICING HIGHLIGHTS
- FBA prep: $1-$2.50/unit
- DTC fulfillment: from $1/unit
- $300 refundable deposit for new clients
- No $3,000 minimums (unlike many competitors)
- Custom pricing for volume clients

## INTEGRATIONS
- Shopify (native real-time sync)
- Amazon Seller Central
- TikTok Shop
- Walmart WFS
- WooCommerce, BigCommerce, Faire, Etsy, and 30+ platforms

## YOUR TASK
Analyze the lead information provided and generate a compelling "why we're a good fit" response. Structure your response as follows:

### 1. Lead Summary
Brief overview of the company, their needs, and volume.

### 2. Why Westfield Is the Perfect Fit
Match their specific needs to our services. Be specific — reference their exact requirements and how we address each one. Include:
- Service alignment (which of our services match their needs)
- Location advantage (if relevant — port proximity, SoCal preference, national coverage)
- Scalability (how we can grow with them)
- Pricing advantage (no minimums, competitive rates)

### 3. Key Selling Points
3-5 bullet points tailored to THIS specific lead.

### 4. Potential Concerns & How to Address
Any red flags or challenges, with suggested responses.

### 5. Recommended Acceptance Message
A ready-to-send message explaining why you want to accept this lead. This should be professional, specific to their needs, and highlight our strengths. Keep it to 2-3 paragraphs.

Be specific, data-driven, and reference the lead's exact requirements. Do not make up capabilities we don't have.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { raw_data, company_name } = await req.json();

    if (!raw_data) {
      return new Response(JSON.stringify({ error: 'raw_data is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyze this lead and generate a "why we're a good fit" response:\n\n${raw_data}` }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited. Please try again in a moment.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      console.error('[analyze-lead] AI error:', status);
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices?.[0]?.message?.content || 'No analysis generated.';

    // Save to database
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert({
        company_name: company_name || 'Unknown',
        raw_data,
        ai_analysis: analysis,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('[analyze-lead] DB error:', dbError);
      // Still return analysis even if DB save fails
      return new Response(JSON.stringify({ analysis, saved: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ analysis, lead, saved: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[analyze-lead] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
