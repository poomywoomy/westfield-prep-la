## Goals

1. **Harden security on the logged-in app** (admin + client dashboards) — close real risks, not cosmetic warnings.
2. **Add three new admin tabs** — Gmail, Google Calendar, Google Slides — wired to the existing connector gateway and ready to use.

---

## Part 1 — Security hardening (logged-in surface)

Targeted at issues already surfaced by the audit + a manual pass over auth, RLS, and edge functions. Each item has a concrete fix.

### 1a. Database / RLS posture
- Run `supabase--linter` and address the **5 always-true RLS policies** for INSERT/UPDATE/DELETE (audit_log, etc.) — replace permissive `true` with role-scoped or owner-scoped predicates via a migration.
- Lock down the **18 SECURITY DEFINER functions executable by `anon`** — `REVOKE EXECUTE ... FROM anon` for all functions that don't intentionally serve unauthenticated flows (keep only ones explicitly used by public edge functions).
- Tighten the **18 SECURITY DEFINER functions executable by any authenticated user** — restrict to `service_role` or check `has_role(auth.uid(),'admin')` inside.
- Restrict the **public storage bucket** (`blog-images`) listing — keep public READ on individual objects but disallow bucket-wide LIST via policy.
- Verify every client-data table (skus, inventory_ledger, asn_*, outbound_shipments, shopify_*, quotes, billing_*, qc_images, custom_pricing) has admin + owner-scoped policies for SELECT/INSERT/UPDATE/DELETE — patch any gaps.

### 1b. Auth hardening
- Enable **leaked-password protection (HIBP)** via `configure_auth`.
- Set a **server-enforced minimum password policy** (length + complexity) at the auth provider level (mirrors what `change-password` already enforces).
- Reduce the **OTP / recovery link lifetime** to ≤ 1 hour.
- Confirm `password_expires_at` flow can't be bypassed (already covered by `validate_client_update` trigger — verify and document).
- Add a **rate limit** on `/login` attempts via the existing `check-rate-limit` function (5 attempts / 15 min per email+IP hash).

### 1c. Session / client-side
- Verify `useAutoLogout` is mounted on **every** authenticated page (Admin + Client + Settings + Reset). Add where missing.
- Add a **Content Security Policy** meta tag to `index.html` covering Supabase, GA, GTM, connector-gateway.
- Add `X-Frame-Options: DENY` equivalent via meta + ensure no clickjacking surface on dashboards.
- Strip `console.error`/`console.log` of sensitive payloads in production builds (already mostly gated by `import.meta.env.DEV` — sweep remaining call sites).

### 1d. Edge functions
- Audit every function in `supabase/functions/` for: input validation (Zod), CORS, JWT verification where appropriate, and no secret leakage in logs.
- Add Zod validation to `create-client`, `change-password`, `send-contact-email`, `process-lead-magnet`, `chat-assistant`, `send-roi-report` if missing.
- Confirm `verify_jwt` settings in `supabase/config.toml` match each function's intent (public vs. authenticated).

### 1e. Audit log
- Confirm `audit_log` has **no public INSERT** (per memory). If still permissive, replace with `service_role`-only INSERT and route writes through a SECURITY DEFINER helper.

### Deliverable
A single migration + small code patches; re-run linter; confirm zero criticals and a documented list of accepted warnings.

---

## Part 2 — Gmail, Google Calendar, Google Slides admin tabs

All three are gateway-enabled connectors. The gateway handles OAuth refresh; we just need linked connections + UI + 3 edge functions.

### 2a. Connect the connectors
For each: Gmail (`google_mail`), Google Calendar (`google_calendar`), Google Slides (`google_slides`) — call `standard_connectors--connect` so the user picks/authorizes a connection. Sets `GOOGLE_MAIL_API_KEY`, `GOOGLE_CALENDAR_API_KEY`, `GOOGLE_SLIDES_API_KEY` plus `LOVABLE_API_KEY` in the sandbox.

### 2b. Three new admin sidebar entries
Add to `src/components/app-sidebar-admin.tsx`:
- **Gmail** (icon: `Mail`)
- **Calendar** (icon: `Calendar`)
- **Slides** (icon: `Presentation`)

Add three lazy-loaded tabs in `src/pages/AdminDashboard.tsx`.

### 2c. Tab UIs (admin-only, gated by `role === 'admin'`)

**GmailTab.tsx**
- Inbox list (latest 25, paginated): subject / from / snippet / date — calls `gmail-list-messages`.
- Message detail panel: full body + headers — `gmail-get-message`.
- Compose dialog: To / Subject / Body → `gmail-send-message`.
- Mark read/unread, archive, trash — `gmail-modify-message`.
- Search bar (Gmail query syntax).

**CalendarTab.tsx**
- Calendar picker (defaults to `primary`) — `calendar-list-calendars`.
- Upcoming events list (next 30 days) — `calendar-list-events`.
- Create event dialog: title / start / end / attendees / description — `calendar-create-event`.
- Quick actions: delete / reschedule.

**SlidesTab.tsx**
- "Recent presentations" pulled from Google Drive filter (Slides MIME type) — uses Slides API `presentations.get` after a Drive list (or simply: list by IDs the admin pastes / by recent creation log we store).
  - MVP: text input for an existing presentation ID + "Open / Read structure" + "Create new presentation" button → `slides-create-presentation` returns ID + URL.
- Generate-from-template action: pre-built template (e.g., "Client QBR Deck" with placeholders for client name, period, metrics) → `slides-create-from-template` calls `presentations.create` then `presentations.batchUpdate` to fill placeholders.

### 2d. Edge functions (8 small functions)
All follow the existing pattern (`_shared/cors.ts`, JWT verify, admin-only check, gateway call):

- `gmail-list-messages`
- `gmail-get-message`
- `gmail-send-message`
- `gmail-modify-message` (read/unread/archive/trash)
- `calendar-list-calendars`
- `calendar-list-events`
- `calendar-create-event`
- `slides-create-presentation` (and a small `slides-fill-template` if we ship the QBR template)

Each:
1. Verifies caller is admin (via `has_role`).
2. Validates body with Zod.
3. Calls `https://connector-gateway.lovable.dev/{connector}/...` with `Authorization: Bearer ${LOVABLE_API_KEY}` + `X-Connection-Api-Key: ${CONNECTOR_API_KEY}`.
4. Returns JSON; CORS-safe; no secret leakage.

`supabase/config.toml` entries: all 8 with `verify_jwt = true`.

### 2e. Scope handling
Gmail needs `gmail.readonly`, `gmail.send`, `gmail.modify`. Calendar needs read+write. Slides needs presentations scope. If any call returns `403 insufficient scopes`, surface a "Reconnect with required permissions" toast and call the `reconnect` tool flow.

---

## Out of scope (this plan)
- Sending real customer emails from Gmail (Resend stays as-is for transactional).
- Embedding a full Gmail/Calendar replacement — these tabs are admin operational tools, not full clients.
- Building the QBR slide template content (we'll wire the mechanism; final copy in a follow-up).

---

## Order of execution
1. Run security linter + `cloud_status`; create the security migration; toggle HIBP/OTP settings.
2. Patch edge functions & client-side hardening.
3. Connect the three Google connectors (user interaction).
4. Add 8 edge functions + config.
5. Add sidebar entries + 3 admin tabs.
6. Smoke test each tab end-to-end; re-run linter.

## Approval question
Confirm and I'll start with **Part 1 security migration** first (fastest wins, no user interaction needed), then prompt you to authorize the three Google connections for Part 2.