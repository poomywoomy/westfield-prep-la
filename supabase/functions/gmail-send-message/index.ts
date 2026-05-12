import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, requireAdmin, requireEnv, jsonResponse } from "../_shared/admin-guard.ts";

const GATEWAY = 'https://connector-gateway.lovable.dev/google_mail/gmail/v1';

const Body = z.object({
  to: z.string().min(3).max(2000),
  subject: z.string().min(1).max(500),
  body: z.string().max(200000).optional(),
  bodyHtml: z.string().max(500000).optional(),
  cc: z.string().max(2000).optional(),
  bcc: z.string().max(2000).optional(),
  threadId: z.string().max(200).optional(),
  inReplyTo: z.string().max(500).optional(),
  references: z.string().max(2000).optional(),
});

function b64url(s: string) {
  return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function htmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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
    const { to, subject, body, bodyHtml, cc, bcc, threadId, inReplyTo, references } = parsed.data;
    if (!body && !bodyHtml) return jsonResponse({ error: 'body or bodyHtml required' }, 400);

    const plain = body ?? (bodyHtml ? htmlToText(bodyHtml) : '');
    const html = bodyHtml ?? `<pre style="font-family:inherit;white-space:pre-wrap">${plain.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))}</pre>`;

    const boundary = `b_${crypto.randomUUID().replace(/-/g, '')}`;
    const headerLines = [`To: ${to}`, `Subject: ${subject}`];
    if (cc) headerLines.push(`Cc: ${cc}`);
    if (bcc) headerLines.push(`Bcc: ${bcc}`);
    if (inReplyTo) headerLines.push(`In-Reply-To: ${inReplyTo}`);
    if (references) headerLines.push(`References: ${references}`);
    headerLines.push('MIME-Version: 1.0');
    headerLines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);

    const mime = [
      headerLines.join('\r\n'),
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'Content-Transfer-Encoding: 7bit',
      '',
      plain,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      'Content-Transfer-Encoding: 7bit',
      '',
      html,
      '',
      `--${boundary}--`,
      '',
    ].join('\r\n');

    const raw = b64url(mime);

    const r = await fetch(`${GATEWAY}/users/me/messages/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'X-Connection-Api-Key': Deno.env.get('GOOGLE_MAIL_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(threadId ? { raw, threadId } : { raw }),
    });
    const data = await r.json();
    if (!r.ok) return jsonResponse({ error: 'Gmail send failed', details: data }, r.status);
    return jsonResponse({ success: true, id: data.id });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
