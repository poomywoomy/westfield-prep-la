import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, requireAdmin, requireEnv, jsonResponse } from "../_shared/admin-guard.ts";

const GATEWAY = 'https://connector-gateway.lovable.dev/google_mail/gmail/v1';

// In-memory metadata cache (per isolate). Keys: message id, value: { data, expiresAt }
const META_TTL_MS = 60_000;
const metaCache = new Map<string, { data: unknown; expiresAt: number }>();

function getCached(id: string) {
  const hit = metaCache.get(id);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) { metaCache.delete(id); return null; }
  return hit.data;
}
function setCached(id: string, data: unknown) {
  metaCache.set(id, { data, expiresAt: Date.now() + META_TTL_MS });
  // Cap size
  if (metaCache.size > 500) {
    const firstKey = metaCache.keys().next().value;
    if (firstKey) metaCache.delete(firstKey);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const env = requireEnv(['LOVABLE_API_KEY', 'GOOGLE_MAIL_API_KEY']);
  if (!env.ok) return env.response;
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') ?? '';
    const maxResults = url.searchParams.get('maxResults') ?? '12';
    const pageToken = url.searchParams.get('pageToken') ?? '';
    const labelIds = url.searchParams.get('labelIds') ?? '';
    const params = new URLSearchParams({ maxResults });
    params.set('fields', 'messages/id,nextPageToken');
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

    const messages = (listData.messages ?? []) as { id: string }[];
    const fetchMeta = async (id: string) => {
      const cached = getCached(id);
      if (cached) return cached;
      const r = await fetch(
        `${GATEWAY}/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`,
        { headers }
      );
      if (!r.ok) return null;
      const data = await r.json();
      setCached(id, data);
      return data;
    };

    const settled = await Promise.allSettled(messages.map(m => fetchMeta(m.id)));
    const detailed = settled
      .map(s => s.status === 'fulfilled' ? s.value : null)
      .filter(Boolean);

    return new Response(JSON.stringify({ messages: detailed, nextPageToken: listData.nextPageToken ?? null }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=30' },
    });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
