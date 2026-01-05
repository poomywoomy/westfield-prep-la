import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map country codes to language codes
const countryToLanguage: Record<string, string> = {
  'TH': 'th', // Thailand
  'ES': 'es', // Spain
  'MX': 'es', // Mexico
  'AR': 'es', // Argentina
  'CO': 'es', // Colombia
  'CN': 'zh', // China
  'TW': 'zh', // Taiwan
  'HK': 'zh', // Hong Kong
  'JP': 'ja', // Japan
  'KR': 'ko', // Korea
  'DE': 'de', // Germany
  'FR': 'fr', // France
  'IT': 'it', // Italy
  'PT': 'pt', // Portugal
  'BR': 'pt', // Brazil
  'RU': 'ru', // Russia
  'VN': 'vi', // Vietnam
  'ID': 'id', // Indonesia
  'MY': 'ms', // Malaysia
  'PH': 'tl', // Philippines
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers (Supabase passes this)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip')
      || req.headers.get('cf-connecting-ip');

    console.log('Detecting country for IP:', clientIP);

    if (!clientIP || clientIP === '127.0.0.1' || clientIP.startsWith('192.168.') || clientIP.startsWith('10.')) {
      // Local/private IP - return default
      return new Response(JSON.stringify({ 
        country: 'US', 
        language: 'en',
        detected: false,
        reason: 'local_ip'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use ip-api.com (free, no API key needed, 45 requests/minute)
    const geoResponse = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,country,countryCode`);
    
    if (!geoResponse.ok) {
      throw new Error(`Geolocation API failed: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();
    console.log('Geolocation response:', geoData);

    if (geoData.status !== 'success') {
      return new Response(JSON.stringify({ 
        country: 'US', 
        language: 'en',
        detected: false,
        reason: 'geo_failed'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const countryCode = geoData.countryCode;
    const language = countryToLanguage[countryCode] || 'en';

    return new Response(JSON.stringify({ 
      country: countryCode,
      countryName: geoData.country,
      language,
      detected: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error detecting country:', error);
    return new Response(JSON.stringify({ 
      country: 'US', 
      language: 'en',
      detected: false,
      reason: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 200, // Still return 200 to not break the flow
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
