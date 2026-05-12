## Problem

The Gmail connection currently has these scopes granted:
- `gmail.readonly`, `gmail.send`, `gmail.compose`, `gmail.modify`, `gmail.labels`, `gmail.insert`, `gmail.settings.basic`
- **`gmail.metadata`** ← this is the culprit

Google's Gmail API treats `gmail.metadata` as a **restrictive** scope. When it is present in the OAuth token, every `messages.get?format=full` call is rejected with 403 "Metadata scope does not support 'format=FULL'", regardless of the other scopes also granted. Our edge function detects that and falls back to the metadata-only preview — which is the yellow banner you're seeing.

## Fix

Reconnect the `info email` Gmail connection with the metadata scope **deselected**. The `gmail.readonly` scope already covers everything metadata does (and more), so nothing is lost.

Steps:
1. Trigger a reconnect prompt for the Gmail connection, with required scopes set to the full-access set minus `gmail.metadata`:
   - `gmail.readonly`, `gmail.send`, `gmail.compose`, `gmail.modify`, `gmail.labels`, `gmail.insert`, `gmail.settings.basic`
2. In the connect dialog that opens, **uncheck `gmail.metadata`** before authorizing. Leaving it checked will reproduce the same problem.
3. Complete the Google consent screen.

After reconnect, opening any email should load the full body (HTML + plain text + attachments) and the yellow "read-only preview" banner will disappear.

## No code changes required

The edge function fallback logic is already correct — it just won't need to trigger anymore once the scope is removed. No frontend or backend edits are needed for this fix.
