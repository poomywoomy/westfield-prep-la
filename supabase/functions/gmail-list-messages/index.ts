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
    const q = url.searchParams.get('q') ?? '';
    const maxResults = url.searchParams.get('maxResults') ?? '25';
    const pageToken = url.searchParams.get('pageToken') ?? '';
    const labelIds = url.searchParams.get('labelIds') ?? '';
    const params = new URLSearchParams({ maxResults });
    if (q) params.set('q', q);
    if (pageToken) params.set('pageToken', pageToken);
    if (labelIds) {
      for (const id of labelIds.split(',').filter(Boolean)) {
        params.append('labelIds', id);
      }
    }

    const headers = {
      Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      'X-Connection-Api-Key': Deno.env.get('GOOGLE_MAIL_API_KEY')!,
    };

    const listRes = await fetch(`${GATEWAY}/users/me/messages?${params}`, { headers });
    const listData = await listRes.json();
    if (!listRes.ok) return jsonResponse({ error: 'Gmail list failed', details: listData }, listRes.status);

    const messages = listData.messages ?? [];
    const detailed = await Promise.all(messages.slice(0, 25).map(async (m: { id: string }) => {
      const r = await fetch(`${GATEWAY}/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`, { headers });
      return await r.json();
    }));

    return jsonResponse({ messages: detailed, nextPageToken: listData.nextPageToken ?? null });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
