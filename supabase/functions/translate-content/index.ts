import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hash function for caching
function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

const languageNames: Record<string, string> = {
  'th': 'Thai',
  'es': 'Spanish',
  'zh': 'Chinese (Simplified)',
  'ja': 'Japanese',
  'ko': 'Korean',
  'de': 'German',
  'fr': 'French',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'vi': 'Vietnamese',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, targetLanguage, context } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(JSON.stringify({ error: 'texts array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!targetLanguage || targetLanguage === 'en') {
      // Return original texts if English
      return new Response(JSON.stringify({ 
        translations: texts.map(t => ({ source: t, translated: t, cached: true }))
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check cache for each text
    const results: Array<{ source: string; translated: string; cached: boolean }> = [];
    const textsToTranslate: Array<{ index: number; text: string; hash: string }> = [];

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i].trim();
      if (!text) {
        results[i] = { source: text, translated: text, cached: true };
        continue;
      }

      const hash = hashText(text);
      
      // Check cache
      const { data: cached } = await supabase
        .from('translations')
        .select('translated_text')
        .eq('source_hash', hash)
        .eq('target_language', targetLanguage)
        .single();

      if (cached) {
        results[i] = { source: text, translated: cached.translated_text, cached: true };
      } else {
        textsToTranslate.push({ index: i, text, hash });
        results[i] = { source: text, translated: '', cached: false };
      }
    }

    // If all cached, return early
    if (textsToTranslate.length === 0) {
      return new Response(JSON.stringify({ translations: results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Translate uncached texts using Lovable AI
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const languageName = languageNames[targetLanguage] || targetLanguage;
    
    // Batch translate (up to 10 at a time for efficiency)
    const batchSize = 10;
    for (let i = 0; i < textsToTranslate.length; i += batchSize) {
      const batch = textsToTranslate.slice(i, i + batchSize);
      const textsForPrompt = batch.map((item, idx) => `[${idx}] ${item.text}`).join('\n');

      const systemPrompt = `You are a professional translator for a Los Angeles-based e-commerce fulfillment and prep center website (Westfield Prep Center). 
Translate the following texts to ${languageName}. 
Keep brand names, technical terms like "FBA", "SKU", "3PL", and company names in English.
Maintain the same tone - professional but friendly.
Return ONLY the translations in the same numbered format, nothing else.
${context ? `Context: ${context}` : ''}`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: textsForPrompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lovable AI error:', response.status, errorText);
        throw new Error(`Translation API failed: ${response.status}`);
      }

      const aiData = await response.json();
      const translatedContent = aiData.choices?.[0]?.message?.content || '';

      // Parse the numbered responses
      const lines = translatedContent.split('\n').filter((line: string) => line.trim());
      
      for (const item of batch) {
        // Find the corresponding translation
        const lineIndex = batch.indexOf(item);
        let translatedText = item.text; // Default to original if parsing fails

        for (const line of lines) {
          const match = line.match(/^\[(\d+)\]\s*(.+)$/);
          if (match && parseInt(match[1]) === lineIndex) {
            translatedText = match[2].trim();
            break;
          }
        }

        // If no match found, try to get by line position
        if (translatedText === item.text && lines[lineIndex]) {
          const cleanLine = lines[lineIndex].replace(/^\[\d+\]\s*/, '').trim();
          if (cleanLine) translatedText = cleanLine;
        }

        results[item.index] = { source: item.text, translated: translatedText, cached: false };

        // Cache the translation
        await supabase.from('translations').upsert({
          source_text: item.text,
          source_hash: item.hash,
          target_language: targetLanguage,
          translated_text: translatedText,
          context: context || null,
        }, {
          onConflict: 'source_hash,target_language',
        });
      }
    }

    console.log(`Translated ${textsToTranslate.length} texts to ${targetLanguage}`);

    return new Response(JSON.stringify({ translations: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      translations: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
