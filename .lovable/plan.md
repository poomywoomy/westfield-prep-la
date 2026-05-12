## Bug

Edge function logs show:
```
TypeError: supabase.auth.getClaims is not a function
  at requireAdmin (admin-guard.ts:30)
```

The shared admin guard calls `supabase.auth.getClaims(token)`, which doesn't exist in `@supabase/supabase-js@2.45.0`. Every Gmail, Calendar, and Slides function crashes on the first auth check, which surfaces in the browser as "Failed to fetch" (no CORS headers on the runtime crash response).

## Fix

Update `supabase/functions/_shared/admin-guard.ts` to use the supported `supabase.auth.getUser(token)` method:

- Replace `const { data, error } = await supabase.auth.getClaims(token)` with `const { data, error } = await supabase.auth.getUser(token)`.
- Read `userId` from `data.user.id` instead of `data.claims.sub`.
- Keep the rest of the flow identical (anon client for token validation, service-role client for the `user_roles` lookup, admin role check).

No other files need changes — all 7 edge functions (gmail-list-messages, gmail-get-message, gmail-send-message, gmail-modify-message, calendar-list-events, calendar-create-event, slides-create-presentation) consume `requireAdmin` through this shared module, so a single edit fixes them all. Edge functions auto-deploy after the edit.

## Verification

After deploy, reload the Gmail and Calendar tabs in the admin dashboard. Confirm:
- Network requests to `/functions/v1/gmail-list-messages` and `/functions/v1/calendar-list-events` return 200.
- Edge function logs no longer show the `getClaims` TypeError.
