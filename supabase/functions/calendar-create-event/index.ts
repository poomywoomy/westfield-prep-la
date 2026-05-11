import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, requireAdmin, requireEnv, jsonResponse } from "../_shared/admin-guard.ts";

const GATEWAY = 'https://connector-gateway.lovable.dev/google_calendar/calendar/v3';

const Body = z.object({
  calendarId: z.string().max(200).default('primary'),
  summary: z.string().min(1).max(500),
  description: z.string().max(8000).optional(),
  location: z.string().max(500).optional(),
  start: z.string().min(1),
  end: z.string().min(1),
  attendees: z.array(z.string().email()).max(50).optional(),
  timeZone: z.string().max(100).default('America/Los_Angeles'),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const env = requireEnv(['LOVABLE_API_KEY', 'GOOGLE_CALENDAR_API_KEY']);
  if (!env.ok) return env.response;
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return jsonResponse({ error: parsed.error.flatten() }, 400);
    const p = parsed.data;

    const event = {
      summary: p.summary,
      description: p.description,
      location: p.location,
      start: { dateTime: p.start, timeZone: p.timeZone },
      end: { dateTime: p.end, timeZone: p.timeZone },
      attendees: p.attendees?.map((email) => ({ email })),
    };

    const r = await fetch(`${GATEWAY}/calendars/${encodeURIComponent(p.calendarId)}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'X-Connection-Api-Key': Deno.env.get('GOOGLE_CALENDAR_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    const data = await r.json();
    if (!r.ok) return jsonResponse({ error: 'Calendar create failed', details: data }, r.status);
    return jsonResponse({ success: true, event: data });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
