import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, requireAdmin, requireEnv, jsonResponse } from "../_shared/admin-guard.ts";

const GATEWAY = 'https://connector-gateway.lovable.dev/google_slides/v1';

const Body = z.object({
  title: z.string().min(1).max(300),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const env = requireEnv(['LOVABLE_API_KEY', 'GOOGLE_SLIDES_API_KEY']);
  if (!env.ok) return env.response;
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return jsonResponse({ error: parsed.error.flatten() }, 400);

    const r = await fetch(`${GATEWAY}/presentations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'X-Connection-Api-Key': Deno.env.get('GOOGLE_SLIDES_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: parsed.data.title }),
    });
    const data = await r.json();
    if (!r.ok) return jsonResponse({ error: 'Slides create failed', details: data }, r.status);

    return jsonResponse({
      success: true,
      presentationId: data.presentationId,
      title: data.title,
      url: `https://docs.google.com/presentation/d/${data.presentationId}/edit`,
    });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
