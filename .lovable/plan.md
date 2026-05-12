## Goals
1. Open emails without 403 errors.
2. Make the inbox load noticeably faster.
3. Make the "New / Add signature" flow work and confirm save.

## 1. Fix "Failed to open email" (403 Metadata scope)

Root cause: `gmail-get-message` always requests `format=full`. The Google Mail connector token was granted with the metadata scope, which Gmail rejects for `full`. Even though `gmail.readonly` is in the connector's configured scopes, the live token only has `gmail.metadata`, so every open throws 403.

Changes in `supabase/functions/gmail-get-message/index.ts`:
- First try `format=full`.
- If response is 403 with "Metadata scope" / `PERMISSION_DENIED`, retry with `format=metadata` and request all useful headers (`From,To,Cc,Bcc,Subject,Date,Reply-To,Message-ID`).
- Always return HTTP 200 with a structured payload `{ message, degraded: boolean, reason?: string }` so the frontend never sees a 403 and can show a friendly banner instead of a toast storm.
- When `degraded=true`, include `snippet` from the metadata response as the only body content.

Changes in `src/components/admin/gmail/MessageView.tsx`:
- Read the new envelope. If `degraded`, render a yellow banner: "Read-only preview. Reconnect Gmail with full access to view message bodies." with a button that triggers our existing reconnect helper (or links to Connectors).
- Render `snippet` in place of HTML body when degraded.
- Suppress the multiple error toasts: a single toast on real failure only.

Optional follow-up surfaced to the user: offer a one-click reconnect that requests `gmail.readonly`. We will not auto-trigger reconnect, just expose the button.

## 2. Make Gmail load much faster

Current path: list returns 25 message IDs, then we issue 25 sequential-in-parallel `format=metadata` calls through the gateway before returning anything. Each gateway hop is ~300–600 ms, so first paint waits for the slowest of 25.

Changes in `supabase/functions/gmail-list-messages/index.ts`:
- Drop default `maxResults` from 25 to 15.
- Use `users.messages.list` with `?fields=messages/id,nextPageToken` to skip extra payload.
- Fetch metadata in two waves: first 8 (returned immediately as primary list), remaining 7 fetched in the same handler but with `Promise.allSettled` so a single slow message no longer blocks the whole response.
- Add `Cache-Control: private, max-age=15` to the JSON response so quick folder switches reuse data.

Changes in `src/components/admin/GmailTab.tsx`:
- Wrap the list query in React Query with `staleTime: 30_000` and `keepPreviousData: true` so folder/search switches feel instant.
- Render skeleton rows while loading instead of a blocking spinner.
- Prefetch `gmail-get-message` on row hover (debounced 150 ms) so clicking a message opens instantly.
- Limit the search debounce trigger to fire only when query length >= 2.

## 3. Fix the "Add new signature" button + confirm save

Audit findings in `SignaturesDialog.tsx`:
- The "New" button only resets local state; if the user is already on a fresh form it looks like nothing happens. The "Create" button is also disabled until `name` has text, which the user reads as broken.
- Save uses `useGmailSignatures.create`, which requires an authenticated user; that works (RLS verified), but errors are swallowed into a toast that is easy to miss.

Changes in `src/components/admin/gmail/SignaturesDialog.tsx`:
- Replace the always-visible form with an explicit two-pane flow:
  - Left: signature list + "+ New signature" primary button.
  - Right: empty state ("Select a signature or click New") until New/Edit is chosen.
- Clicking "+ New signature" opens an editable form with `name` focused and a placeholder "Untitled signature".
- Remove the disabled state on the save button; on click, validate and show inline error under `name` if empty.
- Surface backend errors with both a destructive toast and an inline alert at the top of the editor.
- After successful save, keep the new signature selected (instead of resetting to blank) so the user sees it in the list with a green "Saved" pill for 2 s.

Changes in `src/hooks/useGmailSignatures.ts`:
- Wrap insert/update in a single transactional flow: when `is_default` is true, run the unset + insert in `Promise.all` only after confirming the user id; bubble any error.
- Return the inserted/updated row from `create`/`update` so the dialog can select it.

## Verification

- Open an email: confirm no 403; with current scope the user sees the degraded banner and headers + snippet. After reconnect with `gmail.readonly`, full HTML renders.
- Inbox: first paint < 1.5 s on a warm gateway, switching folders is instant from cache.
- Signatures: create one named "Default", mark as default, reload page, confirm it persists and is preselected in compose.

## Out of scope

- Building a richer fallback body parser for metadata-only responses (limited to snippet by Gmail).
- Migrating signature storage to per-account Gmail signatures via `gmail.settings.basic`.
