import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, requireAdmin, requireEnv, jsonResponse } from "../_shared/admin-guard.ts";

const GATEWAY = 'https://connector-gateway.lovable.dev/google_mail/gmail/v1';

const Body = z.object({
  to: z.string().email().max(320),
  subject: z.string().min(1).max(500),
  body: z.string().min(1).max(50000),
  cc: z.string().max(2000).optional(),
  bcc: z.string().max(2000).optional(),
});

function b64url(s: string) {
  return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const env = requireEnv(['LOVABLE_API_KEY', 'GOOGLE_MAIL_API_KEY']);
  if (!env.ok) return env.response;
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return jsonResponse({ error: parsed.error.flatten() }, 400);
    const { to, subject, body, cc, bcc } = parsed.data;

    const headers = [`To: ${to}`, `Subject: ${subject}`];
    if (cc) headers.push(`Cc: ${cc}`);
    if (bcc) headers.push(`Bcc: ${bcc}`);
    headers.push('Content-Type: text/plain; charset="UTF-8"', '', body);
    const raw = b64url(headers.join('\r\n'));

    const r = await fetch(`${GATEWAY}/users/me/messages/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'X-Connection-Api-Key': Deno.env.get('GOOGLE_MAIL_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });
    const data = await r.json();
    if (!r.ok) return jsonResponse({ error: 'Gmail send failed', details: data }, r.status);
    return jsonResponse({ success: true, id: data.id });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
