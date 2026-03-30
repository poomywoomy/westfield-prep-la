import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a sales analyst for Westfield Prep Center, a Los Angeles-based fulfillment and prep center.

## ABOUT WESTFIELD PREP CENTER
- **Location**: Los Angeles, CA — near LA/Long Beach ports
- **Specialties**: Amazon FBA prep, Shopify DTC fulfillment, TikTok Shop fulfillment, multi-channel logistics
- **Services**: FBA prep (24-48hr turnaround), DTC fulfillment (same-day shipping), TikTok Shop, kitting & bundling, returns processing, receiving & inspection, climate-controlled storage, labeling & compliance, inventory management
- **Pricing**: FBA prep $1-$2.50/unit, DTC from $1/unit, $300 refundable deposit, no minimums
- **Integrations**: Shopify, Amazon, TikTok Shop, Walmart, WooCommerce, BigCommerce, Faire, Etsy, 30+ platforms

## YOUR TASK
Analyze the lead and produce exactly TWO sections separated by the line "---RESPONSE---" on its own line.

### Section 1: SUMMARY
Write a structured summary broken into bullet points or short labeled sections. Cover:
- **Who they are**: Company name, what they sell, their business model
- **What they need**: Specific services requested (prep, storage, fulfillment, etc.)
- **Volume & scale**: Monthly orders, unit counts, storage needs, truckloads
- **Channels**: Which sales channels they use (Amazon, Shopify, DTC, etc.)
- **Notable details**: Any special requirements, concerns, or standout info
- **Fit assessment**: Quick take on how well they match our capabilities

Keep each point concise (1-2 sentences max). This is for internal reference only.

### Section 2: ACCEPTANCE MESSAGE
Write a professional outreach message. Guidelines:
- Start with "Dear [Company/Brand Name] Team,"
- Write 3-4 paragraphs (not 2, not 5)
- First paragraph: Acknowledge who they are and what they're looking for
- Second paragraph: Explain specifically how we can handle their needs — mention relevant services, capabilities, and logistics naturally
- Third paragraph: Add a secondary value point — location advantage, scalability, technology, or flexibility that matters to THIS lead
- Final paragraph: Warm closing with a soft next-step invite (e.g., "We'd love to learn more about your workflow and put together a tailored plan — happy to jump on a quick call whenever works for you.")
- Sign off with "Best regards,\nWestfield Prep Center Team"
- Do NOT brag, list awards, or pat yourself on the back
- Be warm, professional, and solution-focused
- Write in first person plural ("we")
- Do NOT use markdown formatting — write plain text only

Be specific to THIS lead. Reference their actual needs.`;

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
