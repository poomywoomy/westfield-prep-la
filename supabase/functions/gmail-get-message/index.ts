import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, requireAdmin, requireEnv, jsonResponse } from "../_shared/admin-guard.ts";

const GATEWAY = 'https://connector-gateway.lovable.dev/google_mail/gmail/v1';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const env = requireEnv(['LOVABLE_API_KEY', 'GOOGLE_MAIL_API_KEY']);
  if (!env.ok) return env.response;
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonResponse({ error: 'id required' }, 400);

    const r = await fetch(`${GATEWAY}/users/me/messages/${encodeURIComponent(id)}?format=full`, {
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'X-Connection-Api-Key': Deno.env.get('GOOGLE_MAIL_API_KEY')!,
      },
    });
    const data = await r.json();
    if (!r.ok) return jsonResponse({ error: 'Gmail get failed', details: data }, r.status);
    return jsonResponse(data);
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
