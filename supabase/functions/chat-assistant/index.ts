import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Wes, a friendly sales assistant for Westfield Prep Center — a Los Angeles-based Amazon FBA prep center and e-commerce fulfillment company.

## STRICT RULES
- Keep responses under 3 sentences unless asked for detail
- Never collect personal data — direct to intake form or Calendly
- Never provide exact pricing — say "pricing is custom" and direct to form/call

## APPROVED FACTS

**Company**: Los Angeles, CA (near ports), 50+ clients, 2M+ units processed, family-owned

**Sales Channels**: Amazon FBA, Shopify, TikTok Shop (48-hour SLA, 6-hour avg processing, 10x surge capacity), Walmart WFS, Etsy, WooCommerce, BigCommerce, Faire, Magento, Wix — 30+ integrations

**Services & Speed**:
- FBA Prep: 24-48 hours (same-day rush), FNSKU labeling, poly bagging, bundling
- DTC Fulfillment: Same-day shipping before 12pm PT
- TikTok Shop: 6-hour avg, 48-hour SLA guaranteed
- Kitting: 1-3 days, no minimums, subscription boxes, PR boxes
- Returns: 5-hour inspection, QC photos
- Receiving: 4-hour avg, ASN required 24h ahead
- Storage: Climate-controlled 72°F, 24/7 surveillance
- Labeling: FNSKU, Prop 65, FDA, 1-2 days

**Pricing**: FBA prep $1-$2.50/unit, DTC from $1/unit. $300 deposit for new clients. No $3K minimums.

**Ideal Clients**: Amazon sellers 100-50,000 units/month, Shopify/DTC brands, TikTok Shop sellers, multi-channel sellers

**CTAs**: /intake (onboarding), /contact (inquiries), /pricing, https://calendly.com/westfieldprepcenter/30min (book call)

Respond helpfully and direct high-intent users to intake form or Calendly.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      console.error('[chat-assistant] LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Chat service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('[chat-assistant] AI Gateway error:', response.status);
      return new Response(
        JSON.stringify({ error: response.status === 429 ? 'Too many requests' : 'Service unavailable' }),
        { status: response.status === 429 ? 429 : 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });

  } catch (error) {
    console.error('[chat-assistant] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Please call (818) 935-5478 or use the contact form.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
