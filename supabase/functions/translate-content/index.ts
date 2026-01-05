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

// Normalize text consistently (trim whitespace, normalize newlines)
function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
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
        translations: texts.map(t => ({ source: normalizeText(t), translated: normalizeText(t), cached: true }))
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Normalize all texts and compute hashes upfront
    const normalizedTexts = texts.map(t => normalizeText(t));
    const hashMap = new Map<string, { index: number; text: string; hash: string }>();
    const results: Array<{ source: string; translated: string; cached: boolean }> = new Array(texts.length);

    // Build hash map for unique texts only
    for (let i = 0; i < normalizedTexts.length; i++) {
      const text = normalizedTexts[i];
      if (!text) {
        results[i] = { source: text, translated: text, cached: true };
        continue;
      }
      const hash = hashText(text);
      if (!hashMap.has(hash)) {
        hashMap.set(hash, { index: i, text, hash });
      }
    }

    const uniqueHashes = Array.from(hashMap.keys());
    
    // BULK CACHE LOOKUP - single query for all hashes
    let cachedTranslations: Record<string, string> = {};
    if (uniqueHashes.length > 0) {
      const { data: cached } = await supabase
        .from('translations')
        .select('source_hash, translated_text')
        .eq('target_language', targetLanguage)
        .in('source_hash', uniqueHashes);

      if (cached) {
        for (const row of cached) {
          cachedTranslations[row.source_hash] = row.translated_text;
        }
      }
    }

    // Separate cached vs uncached
    const textsToTranslate: Array<{ index: number; text: string; hash: string }> = [];

    for (let i = 0; i < normalizedTexts.length; i++) {
      const text = normalizedTexts[i];
      if (!text) continue;
      
      const hash = hashText(text);
      
      if (cachedTranslations[hash]) {
        results[i] = { source: text, translated: cachedTranslations[hash], cached: true };
      } else {
        textsToTranslate.push({ index: i, text, hash });
        results[i] = { source: text, translated: '', cached: false };
      }
    }

    // If all cached, return early
    if (textsToTranslate.length === 0) {
      console.log(`All ${texts.length} texts found in cache for ${targetLanguage}`);
      return new Response(JSON.stringify({ translations: results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Translating ${textsToTranslate.length} uncached texts to ${targetLanguage} (${texts.length - textsToTranslate.length} cached)`);

    // Translate uncached texts using Lovable AI
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const languageName = languageNames[targetLanguage] || targetLanguage;
    
    // Batch translate (up to 20 at a time for efficiency)
    const batchSize = 20;
    const newTranslations: Array<{ text: string; hash: string; translated: string }> = [];

    for (let i = 0; i < textsToTranslate.length; i += batchSize) {
      const batch = textsToTranslate.slice(i, i + batchSize);
      const textsForPrompt = batch.map((item, idx) => `[${idx}] ${item.text}`).join('\n');

      const systemPrompt = `You are a professional translator for a Los Angeles-based e-commerce fulfillment and prep center website (Westfield Prep Center). 
Translate the following texts to ${languageName}.

TRANSLATION STYLE:
- Use a CONVERSATIONAL PROFESSIONAL tone, like talking to a trusted business partner
- Sound natural and approachable, NOT stiff or overly formal
- Avoid corporate jargon or legal-sounding language
- Keep it warm, friendly, and relatable while staying professional
- Use everyday language that people actually speak

RULES:
- Keep brand names, company names, and technical terms (FBA, SKU, 3PL, FNSKU, DTC, Shopify, Amazon, TikTok) in English
- Return ONLY the translations in the same numbered format, nothing else
- Preserve any emojis in the original text
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
        newTranslations.push({ text: item.text, hash: item.hash, translated: translatedText });
      }
    }

    // BULK UPSERT - single call for all new translations
    if (newTranslations.length > 0) {
      const upsertData = newTranslations.map(t => ({
        source_text: t.text,
        source_hash: t.hash,
        target_language: targetLanguage,
        translated_text: t.translated,
        context: context || null,
      }));

      const { error: upsertError } = await supabase
        .from('translations')
        .upsert(upsertData, { onConflict: 'source_hash,target_language' });

      if (upsertError) {
        console.error('Bulk upsert error:', upsertError);
      }
    }

    console.log(`Translated ${textsToTranslate.length} texts to ${targetLanguage}, cached ${newTranslations.length} new translations`);

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
