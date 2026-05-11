import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, requireAdmin, requireEnv, jsonResponse } from "../_shared/admin-guard.ts";

const GATEWAY = 'https://connector-gateway.lovable.dev/google_calendar/calendar/v3';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const env = requireEnv(['LOVABLE_API_KEY', 'GOOGLE_CALENDAR_API_KEY']);
  if (!env.ok) return env.response;
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(req.url);
    const calendarId = url.searchParams.get('calendarId') ?? 'primary';
    const timeMin = url.searchParams.get('timeMin') ?? new Date().toISOString();
    const timeMax = url.searchParams.get('timeMax') ?? new Date(Date.now() + 30 * 86400000).toISOString();
    const maxResults = url.searchParams.get('maxResults') ?? '50';

    const params = new URLSearchParams({ timeMin, timeMax, maxResults, singleEvents: 'true', orderBy: 'startTime' });
    const r = await fetch(`${GATEWAY}/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'X-Connection-Api-Key': Deno.env.get('GOOGLE_CALENDAR_API_KEY')!,
      },
    });
    const data = await r.json();
    if (!r.ok) return jsonResponse({ error: 'Calendar list failed', details: data }, r.status);
    return jsonResponse(data);
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
