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

    const headers = {
      Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      'X-Connection-Api-Key': Deno.env.get('GOOGLE_MAIL_API_KEY')!,
    };

    // Try full first
    let r = await fetch(`${GATEWAY}/users/me/messages/${encodeURIComponent(id)}?format=full`, { headers });
    let data = await r.json();

    if (!r.ok) {
      const msg = JSON.stringify(data);
      const isScopeIssue = r.status === 403 && /metadata scope|insufficient/i.test(msg);
      if (isScopeIssue) {
        // Fallback to metadata format
        const metaUrl = `${GATEWAY}/users/me/messages/${encodeURIComponent(id)}?format=metadata` +
          `&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc` +
          `&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=Reply-To&metadataHeaders=Message-ID`;
        const r2 = await fetch(metaUrl, { headers });
        const d2 = await r2.json();
        if (!r2.ok) {
          return jsonResponse({ message: null, degraded: true, reason: 'gmail_scope_metadata_only', error: d2 }, 200);
        }
        return jsonResponse({
          message: d2,
          degraded: true,
          reason: 'gmail_scope_metadata_only',
        }, 200);
      }
      return jsonResponse({ message: null, degraded: false, error: 'Gmail get failed', details: data }, 200);
    }

    return jsonResponse({ message: data, degraded: false });
  } catch (e) {
    return jsonResponse({ message: null, degraded: false, error: e instanceof Error ? e.message : 'Unknown error' }, 200);
  }
});
