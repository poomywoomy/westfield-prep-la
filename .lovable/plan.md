# Gmail Tab Upgrade Plan

Improve the admin Gmail experience with proper folders, working search, full message view, a rich-text composer, and reusable signatures.

## 1. Folders / Labels (Inbox, Sent, Drafts, etc.)

- Add a left sidebar inside `GmailTab.tsx` listing system labels: **Inbox, Starred, Sent, Drafts, Spam, Trash, All Mail**.
- Default selection: Inbox. Selecting a folder calls `gmail-list-messages` with the matching `labelIds` query param (e.g. `SENT`, `DRAFT`, `TRASH`).
- Update `gmail-list-messages` edge function to accept and forward `labelIds` (comma-separated) in addition to the existing `q` param.
- Show unread count badge per folder using Gmail `labels.get` (new lightweight `gmail-list-labels` edge function or piggyback on list response).

## 2. Working Search Bar

- The current search input only fires on Enter. Keep Enter, but also:
  - Add a Search button next to the input.
  - Debounce typing (400ms) so results refresh automatically.
  - Show the active query as a removable chip above the list.
- Pass the query through Gmail's `q` operator syntax (already supported by the edge function), with helper hint text under the input listing common operators (`from:`, `to:`, `subject:`, `is:unread`, `has:attachment`, `after:YYYY/MM/DD`).

## 3. Open / Read Full Email

- Clicking a row opens a full-message dialog (or right-side pane on wide screens) backed by `gmail-get-message` (already exists).
- Render:
  - Headers: From, To, Cc, Date, Subject.
  - HTML body when available (sanitized with DOMPurify), fallback to plain text.
  - Attachment list with download buttons (new `gmail-get-attachment` edge function returning base64 → blob).
- Actions in the open view: **Reply, Reply all, Forward, Archive, Mark unread, Trash, Star**. Reply/Forward prefills the rich composer with quoted history.
- Auto-mark message as read when opened (calls `gmail-modify-message` with `mark_read`).

## 4. Rich-Text Composer

- Replace the plain `<Textarea>` in the compose dialog with a TipTap editor (already used in `RichTextEditor.tsx` for blog).
- Create a new lightweight `EmailRichTextEditor.tsx` configured with: bold, italic, underline, strikethrough, bullet list, ordered list, headings (H1–H3), font size, font family, text color, highlight color, link, blockquote, horizontal rule, undo/redo, clear formatting.
- Store editor output as HTML.
- Update `gmail-send-message` edge function:
  - Accept `bodyHtml` (and keep `body` for plaintext fallback).
  - Build a `multipart/alternative` MIME message with both `text/plain` and `text/html` parts (still base64url-encoded into `raw`).
  - Add Cc / Bcc fields in the UI (already supported server-side).

## 5. Multiple Signatures

- New table `gmail_signatures` (admin-only RLS):
  - `id uuid pk`, `user_id uuid`, `name text`, `body_html text`, `is_default boolean`, `created_at`, `updated_at`.
  - RLS: only owner (and admins) can read/write their own rows.
- New "Signatures" management dialog accessible from the Gmail tab header (gear icon):
  - List signatures, create/edit/delete, mark one as default, edit body in the same rich-text editor.
- In compose dialog:
  - Signature dropdown above the editor (defaults to the user's default signature).
  - Selecting a signature appends/replaces the trailing `<div class="signature">…</div>` block in the editor.
  - Switching signatures swaps the block in place.

## Technical Details

**Files to add**
- `src/components/admin/gmail/EmailRichTextEditor.tsx` — TipTap with extended toolbar (FontSize, FontFamily, Color, Highlight, Link).
- `src/components/admin/gmail/MessageView.tsx` — full message reader with actions.
- `src/components/admin/gmail/SignaturesDialog.tsx` — CRUD UI for signatures.
- `src/components/admin/gmail/FolderSidebar.tsx` — label list + counts.
- `src/hooks/useGmailSignatures.ts` — fetch/mutate signatures via supabase client.
- `supabase/functions/gmail-list-labels/index.ts` — returns labels with unread counts.
- `supabase/functions/gmail-get-attachment/index.ts` — fetches attachment by `messageId` + `attachmentId`.
- Migration: create `gmail_signatures` table + RLS policies + `updated_at` trigger.

**Files to edit**
- `src/components/admin/GmailTab.tsx` — split into sidebar + list + reader; wire search debounce, folder switching, signature dropdown, rich composer.
- `supabase/functions/gmail-list-messages/index.ts` — accept `labelIds` query param, forward to Gmail.
- `supabase/functions/gmail-send-message/index.ts` — accept `bodyHtml`, `cc`, `bcc`, build multipart MIME; keep zod validation.

**Dependencies**
- Add TipTap extensions not yet installed: `@tiptap/extension-font-family`, `@tiptap/extension-text-style` (already present), `dompurify` + `@types/dompurify` for safe HTML rendering. (Font-size requires a small custom TipTap extension or `tiptap-extension-font-size` package.)

**Scopes**
- Existing Gmail connection scopes already cover read/modify/send. No reconnect needed unless a 403 appears at runtime.

## Out of Scope (this iteration)
- Threaded conversation view (messages still listed individually).
- Inline image uploads in the composer.
- Filters, labels CRUD, scheduled send, vacation responder.
