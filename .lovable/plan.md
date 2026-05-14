## Problem

Two compounding issues are causing the open-message flicker/reload and the slow inbox:

### 1. Open-message re-fetch loop (the "load → re-render → load" flicker)

`MessageView`'s data-fetch `useEffect` depends on `[messageId, open, onChanged, toast]`. Both `onChanged` (defined inline in `GmailTab` as `refresh`) and `toast` get new identities on every render of `GmailTab`. Every time the message arrives, `setMsg` triggers a parent re-render (via `onChanged` calling `invalidateQueries` after mark-read), which produces a new `onChanged` reference, which re-runs the effect, which refetches the message, which calls mark-read again, which invalidates queries, which re-renders the parent… loop.

This also explains the repeated `gmail-get-message` boots in the edge logs and the multiple "loading indicator re-added" entries in the session replay (~6 reloads in 25s on the same opened message).

### 2. Slow inbox load

`gmail-list-messages` does an initial `messages.list` then issues N (=15) sequential-awaited `messages.get?format=metadata` calls. They're in `Promise.allSettled`, so they're parallel, but each one is a full HTTPS round-trip through the gateway, and there's no per-message caching across folder switches. Combined with the re-fetch loop, this makes everything feel sluggish.

Hover prefetch in `GmailTab` also never helps the open path because `MessageView` uses raw `fetch` instead of the React Query cache the prefetch populates.

## Fix

### MessageView (`src/components/admin/gmail/MessageView.tsx`)

Replace the manual `useEffect` + `fetch` with React Query, keyed on `messageId`. This:

- Removes the unstable `onChanged`/`toast` deps that caused the loop.
- Reuses the same cache the hover prefetch in `GmailTab` already populates → opening a hovered message is instant.
- `staleTime: 5 min` so re-opens don't refetch.
- Mark-read side effect moves into a `useEffect` that depends only on `messageId` + the loaded message's `labelIds`, guarded by a `useRef` so it fires once per message (not on every parent re-render).

### Hover prefetch (`src/components/admin/GmailTab.tsx`)

Keep the existing prefetch, but ensure its query key/shape matches what `MessageView` consumes (`["gmail-message", id]` returning the unwrapped `data.message`). Pass the prefetched `QueryClient` through context (already global). No API changes.

### List performance (`supabase/functions/gmail-list-messages/index.ts`)

- Drop `maxResults` default from 15 → 12 to cut metadata round-trips.
- Add a small in-function memory cache (Map keyed on message id) with a 60s TTL so repeat list calls (folder toggles, refresh) skip the per-message gateway hit for messages we've already fetched in this isolate.
- Bump the response `Cache-Control` from `max-age=15` to `max-age=30`.
- Increase client-side `staleTime` on the list query from 30s to 60s so folder switches back-and-forth don't refetch.

### What this does NOT change

- No scope changes, no edge-function contract changes for `gmail-get-message`.
- No UI/visual changes.
- No changes to compose, signatures, or labels code.

## Expected result

- Opening an email: one fetch, no flicker, ~instant if it was hovered first.
- Inbox first load: similar to today on cold cache, noticeably faster on warm cache and folder switches.
- Mark-read still happens exactly once per opened unread message.

## Files touched

- `src/components/admin/gmail/MessageView.tsx` — rewrite data layer with React Query, stabilize mark-read effect.
- `src/components/admin/GmailTab.tsx` — bump `staleTime`, align prefetch shape (small tweak).
- `supabase/functions/gmail-list-messages/index.ts` — in-memory metadata cache, smaller default page, longer Cache-Control.