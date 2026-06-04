import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Simple IP-based rate limiter backed by the public.rate_limits table.
 * Fails OPEN (allows the request) if the backing store is unavailable so that
 * a transient DB issue does not take down public endpoints, while still
 * throttling abusive traffic under normal conditions.
 *
 * Returns true when the request is allowed, false when the limit is exceeded.
 */
export async function checkRateLimit(
  req: Request,
  keyPrefix: string,
  maxRequests: number,
  windowMinutes: number,
): Promise<boolean> {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    const rateKey = `${keyPrefix}_${ip}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

    const { data: existing, error } = await supabase
      .from("rate_limits")
      .select("id, request_count")
      .eq("rate_key", rateKey)
      .gte("window_start", windowStart.toISOString())
      .order("window_start", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[rate-limit] lookup error:", error.message);
      return true; // fail open
    }

    if (existing) {
      if ((existing.request_count || 0) >= maxRequests) {
        return false;
      }
      await supabase
        .from("rate_limits")
        .update({ request_count: (existing.request_count || 0) + 1 })
        .eq("id", existing.id);
      return true;
    }

    await supabase.from("rate_limits").insert({
      rate_key: rateKey,
      window_start: now.toISOString(),
      request_count: 1,
    });
    return true;
  } catch (e) {
    console.error("[rate-limit] unexpected error:", e);
    return true; // fail open
  }
}
