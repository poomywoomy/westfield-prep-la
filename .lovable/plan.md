# Remodel the Create Quote screen

Same quote-building ideas, same fields, same PDF output. This is a visual and layout overhaul of the admin "Create Quote" dialog only.

## What's clunky today

- One long scrolling column: toggle, four stacked full-width contact inputs, minimum-spend box, then Standard Operations, then Fulfillment Services, then comments.
- Every line item is a bordered row that flips between a plain text summary and a raw grid of Select + number input + a full textarea, so editing one service pushes the whole page around.
- No running total, no sense of how many services are on the quote, no summary before you hit Generate PDF.
- Section headers are default shadcn cards with no hierarchy or brand feel.

## New structure

A two-pane dialog (wider, fixed height, internal scrolling) instead of one long scroll.

```text
┌──────────────────────────────────────────────┬──────────────────┐
│ Create Quote            [Standard | Team]    │  QUOTE SUMMARY   │
├──────────────────────────────────────────────┤                  │
│ 1  Client                                    │  Client name     │
│    [Company] [Contact]                       │  Contact/email   │
│    [Email]   [Phone]                         │  ---             │
│                                              │  Standard   8    │
│ 2  Minimum monthly spend                     │  Amazon FBA 4    │
│    [tier pills: 250→500 | 500 | 1k | custom] │  B2B        3    │
│                                              │  ---             │
│ 3  Standard operations          8 services   │  Minimum: $500/mo│
│    ▸ compact service rows                    │                  │
│                                              │                  │
│ 4  Fulfillment services                      │  [Generate PDF]  │
│    [+ Amazon FBA] [+ Walmart] [+ TikTok] ... │  [Cancel]        │
│    ▸ channel group cards, collapsible        │                  │
│                                              │                  │
│ 5  Additional comments                       │                  │
└──────────────────────────────────────────────┴──────────────────┘
```

### Left pane — numbered steps

Each block gets a numbered marker, a title, and a hairline rule (matching the site's technical-editorial style) rather than nested shadcn cards. Contact fields go to a 2-column grid: Company / Contact on row one, Email / Phone on row two.

Minimum monthly spend becomes selectable pills instead of a dropdown, with the custom intro/ongoing inputs revealed inline when Custom is chosen. Team Quote Mode moves from a bordered switch row to a segmented control in the dialog header (Standard Quote / Team Quote).

### Service rows — the main fix

Replace the flip-between-two-layouts row with one consistent, dense row:

- Service name (select or custom text), price input with a `$` prefix, notes as a single-line input that expands on focus, and a delete icon — all on one line on desktop, stacking on mobile.
- Rows are always editable, so no Edit/Check toggle dance and no layout jump. The `isEditing` flag stays in state but stops driving two separate layouts.
- Auto-filled notes render as muted placeholder-style text so it's obvious they're defaults.
- Zebra/hover treatment plus a header row (Service · Price · Notes) so it reads like a rate sheet.

### Fulfillment channel groups

Each channel becomes a collapsible group with a colored channel chip, item count, and its own "Add service" and remove controls in the group header. Collapsed by default once it has items, so a 4-channel quote stays scannable.

### Right pane — live summary

Sticky panel showing client name, per-section service counts, the resolved minimum-spend line in plain English, and the primary Generate PDF / Cancel actions. Replaces the footer buttons that currently sit below a long scroll.

### Empty states

Standard Operations and each channel get a short empty state with an add button instead of blank space.

## Technical notes

- Only `src/components/admin/CreateQuoteDialog.tsx` changes; extract the repeated line-item row into a local `ServiceRow` component and the channel group into `ChannelGroup` in the same file (or a sibling file under `src/components/admin/quote/`).
- All state, handlers, defaults (`AUTO_NOTES`, `DEFAULT_PRICES`, service lists), validation, `generateQuotePDF` payload, and `MINIMUM_SPEND_TIERS` encoding (`custom:intro_then_ongoing`) stay exactly as they are.
- Styling uses existing semantic tokens and shadcn primitives (Collapsible, ToggleGroup, ScrollArea) — no new colors hardcoded, no new dependencies.
- `DialogContent` goes to `max-w-6xl h-[88vh]` with the two panes handling their own overflow.
