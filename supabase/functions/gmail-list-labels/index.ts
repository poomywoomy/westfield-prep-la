import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, requireAdmin, requireEnv, jsonResponse } from "../_shared/admin-guard.ts";

const GATEWAY = 'https://connector-gateway.lovable.dev/google_mail/gmail/v1';
const SYSTEM = ['INBOX', 'STARRED', 'SENT', 'DRAFT', 'SPAM', 'TRASH', 'IMPORTANT'];

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const env = requireEnv(['LOVABLE_API_KEY', 'GOOGLE_MAIL_API_KEY']);
  if (!env.ok) return env.response;
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const headers = {
      Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      'X-Connection-Api-Key': Deno.env.get('GOOGLE_MAIL_API_KEY')!,
    };

    const counts = await Promise.all(
      SYSTEM.map(async (id) => {
        const r = await fetch(`${GATEWAY}/users/me/labels/${id}`, { headers });
        if (!r.ok) return { id, unread: 0, total: 0 };
        const d = await r.json();
        return { id, unread: d.messagesUnread ?? 0, total: d.messagesTotal ?? 0 };
      })
    );

    return jsonResponse({ labels: counts });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
