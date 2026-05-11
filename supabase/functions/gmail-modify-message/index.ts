import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, requireAdmin, requireEnv, jsonResponse } from "../_shared/admin-guard.ts";

const GATEWAY = 'https://connector-gateway.lovable.dev/google_mail/gmail/v1';

const Body = z.object({
  id: z.string().min(1).max(200),
  action: z.enum(['mark_read', 'mark_unread', 'archive', 'trash', 'untrash']),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const env = requireEnv(['LOVABLE_API_KEY', 'GOOGLE_MAIL_API_KEY']);
  if (!env.ok) return env.response;
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return jsonResponse({ error: parsed.error.flatten() }, 400);
    const { id, action } = parsed.data;

    let path = '';
    let body: Record<string, unknown> | null = null;
    switch (action) {
      case 'mark_read': path = `/users/me/messages/${id}/modify`; body = { removeLabelIds: ['UNREAD'] }; break;
      case 'mark_unread': path = `/users/me/messages/${id}/modify`; body = { addLabelIds: ['UNREAD'] }; break;
      case 'archive': path = `/users/me/messages/${id}/modify`; body = { removeLabelIds: ['INBOX'] }; break;
      case 'trash': path = `/users/me/messages/${id}/trash`; break;
      case 'untrash': path = `/users/me/messages/${id}/untrash`; break;
    }

    const r = await fetch(`${GATEWAY}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'X-Connection-Api-Key': Deno.env.get('GOOGLE_MAIL_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await r.json();
    if (!r.ok) return jsonResponse({ error: 'Gmail modify failed', details: data }, r.status);
    return jsonResponse({ success: true });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
