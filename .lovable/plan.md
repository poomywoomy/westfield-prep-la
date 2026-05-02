# Email Functionality Audit — Contact Form

## Test Result: PASSED

I ran a live end-to-end test against the deployed `send-contact-email` function. Resend accepted the message (id `11a6bdbb-baa7-42e9-8ae6-db0f7ecbdf2d`) and the function returned `200 OK`. **A real email was sent to `info@westfieldprepcenter.com`** — please confirm it arrived (check inbox + spam).

## What's Working

- **Resend domain `westfieldprepcenter.com` is verified** (sending enabled).
- `RESEND_API_KEY` secret is configured.
- Edge function `send-contact-email` is deployed with `verify_jwt = false` (correct for public form).
- CORS headers present on all responses.
- Zod validation on both client and server.
- Rate limiting (5/hour per IP server-side + 3/5min per email client-side).
- HTML escaping prevents XSS in email body.
- Conditional 3PL vs Launchpad blocks render correctly.
- Reply-to is set to the submitter's email so you can reply directly.
- Confirmation email is sent to the submitter.

## Issues Found

### 1. Confirmation email failure is silently swallowed (Medium)
If the second Resend call fails, the function logs `"Confirmation email delivery failed"` but the user still sees "Success!" and no detail is captured. Recommend logging the actual Resend error body so failures are debuggable.

### 2. Errors return generic strings, response bodies from Resend not logged (Medium)
On send failure, `console.error("Email delivery failed")` runs without the Resend error payload. If you ever stop receiving emails, you'll have no clue why. Recommend logging `data` from Resend on non-OK responses.

### 3. Logo image URL likely 404s in confirmation email (Low)
Confirmation HTML references `https://westfieldprepcenter.com/westfield-logo.png`. I'll verify this file exists in `public/`. If missing, the confirmation email shows a broken image.

### 4. No persistent record of submissions (Low — optional)
Submissions are sent via email only — nothing is stored. If Resend ever has an outage or you miss an email, the lead is lost. Optional: add a lightweight `contact_submissions` table to log every submission as a backup.

### 5. `recipientEmail` is sent from client (Low — security/minor)
The client passes `recipientEmail: "info@westfieldprepcenter.com"`. A malicious actor could change this to redirect leads. Recommend hardcoding the recipient inside the edge function instead of trusting client input.

## Proposed Fixes (when you approve)

1. **Improve error logging** in `send-contact-email/index.ts` — log Resend response bodies on failure for both admin + confirmation sends.
2. **Hardcode recipient** — remove `recipientEmail` from the request body; use `const RECIPIENT = "info@westfieldprepcenter.com"` inside the function.
3. **Verify/fix logo URL** — check `public/westfield-logo.png` exists; swap to a known-good asset path if not.
4. **(Optional)** Add a `contact_submissions` table with RLS (admin-read, public-insert blocked, function-insert via service role) so every lead is persisted as a backup to email.

## Files to Change
- `supabase/functions/send-contact-email/index.ts` (logging + hardcoded recipient + redeploy)
- `src/components/ContactForm.tsx` (drop `recipientEmail` from invoke body)
- *(optional)* migration for `contact_submissions` table

## Confirm Before I Implement
- Does the test email I just sent actually appear in your `info@westfieldprepcenter.com` inbox? (This is the real proof.)
- Do you want fixes 1–3, or all four including the backup table (#4)?
