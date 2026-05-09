## Redesign two sections on the Launchpad page

Keep the page's existing palette (cream `#f6f1ea`, charcoal `#1a1a1a`, terracotta `#c97b54`) and the brand voice. Only the **"Not sure what you need?"** block and the **FAQ** block change. Hero, services grid, modals, and CTA stay as-is.

---

### 1. "Not sure what you need?" → **Service Picker Console**

Replace the current heading + 8 stacked checkbox rows with a more editorial, interactive layout.

**New layout (desktop):**

```text
┌─────────────────────────────────────────────────────────────┐
│  START HERE                                                 │
│  Build your launch stack.                                   │
│  Pick what you need. We will quote it as one package.       │
│                                                             │
│  ┌──────────────┬──────────────────────────────────────────┐│
│  │ [01] Shopify │  Hover/active preview pane:              ││
│  │ [02] Amazon  │  ─ Service name + tagline                ││
│  │ [03] A+      │  ─ One-line summary                      ││
│  │ [04] Store…  │  ─ 3 quick "what you get" chips          ││
│  │ [05] 3D      │  ─ "See full details →" opens modal      ││
│  │ [06] Photo   │  ─ "Add to my stack" toggle (checkbox)   ││
│  │ [07] Copy    │                                          ││
│  │ [+] Fulfill. │                                          ││
│  └──────────────┴──────────────────────────────────────────┘│
│                                                             │
│  Selected: [Shopify] [A+ Content] [Photo]   [Get a quote →] │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Left rail: numbered list of all 8 items (7 services + "fulfillment partner from day one"). Hover/click sets the active item; the active row gets the terracotta accent + a thin left border.
- Right preview pane updates instantly with that service's name, tagline, summary, and 3 deliverable chips pulled from `LAUNCHPAD_SERVICES`. Two buttons inside: **See full details** (opens existing `ServiceDetailModal`) and **Add to my stack** (toggle).
- Bottom bar: shows pill chips of the user's selected stack with a remove "x". A primary **Get a quote** button deep-links to `/contact?service=launchpad&focus=<slug1>,<slug2>,...` (comma-joined). If nothing is selected, button shows "Not sure? Book a call" → `/contact?service=launchpad`.
- Mobile: collapses to a single column. Tapping a row expands the preview inline (accordion-style) instead of a side pane.

**Visual touches:**
- Numbered `01 / 07` labels in mono-style tracking (matches site).
- Subtle terracotta dot indicator on the active row.
- A faint hand-drawn arrow / dotted connector graphic from the active row into the preview pane (pure CSS, on desktop only) so it feels like a console, not a list.
- Background stays `#f6f1ea` but the picker sits inside a single rounded card (`bg-white/70`, soft shadow) so it reads as one premium component instead of 8 separate boxes.

---

### 2. FAQ → **Two-column "Operator's Notebook"**

Replace the centered single-column accordion with a magazine/notebook layout that better matches the page's editorial tone.

**New layout (desktop):**

```text
┌─────────────────────────────────────────────────────────────┐
│  FAQ · Launchpad Q&A                                        │
│  ┌─────────────────────────┬───────────────────────────────┐│
│  │ Sticky title block:     │  Numbered question list:      ││
│  │ "Launchpad questions"   │  01 ─ Do I need to be a       ││
│  │ Straight answers,       │       fulfillment client?     ││
│  │ no filler.              │  02 ─ How long does a launch  ││
│  │                         │       project take?           ││
│  │ Categories pills:       │  03 ─ Do I ship product to    ││
│  │ [All] [Setup] [Creative]│       your studio?            ││
│  │ [Timeline] [Logistics]  │  ...                          ││
│  │                         │                               ││
│  │ Still stuck?            │  Each item: large numbered    ││
│  │ → Book a 20 min call    │  question, click to slide     ││
│  └─────────────────────────┴───────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Left column (sticky on desktop): eyebrow, big title, intro line, category filter pills (All / Setup / Creative / Timeline / Logistics), and a small "Still stuck? Book a call →" CTA card.
- Right column: each FAQ rendered as a **numbered row** (`01`, `02`, …) with a large question on a single line and a thin divider beneath. Click expands the answer below with a smooth height animation. Active item swaps the number color to terracotta and bolds the question.
- Filter pills filter the visible list (tag each FAQ entry with one category in the data array).
- Mobile: single column, sticky title becomes a normal header at the top. Filter pills horizontal-scroll.

**Visual touches:**
- Big tabular `01` / `02` numbers (font-light, 2xl) on the left of each question — gives it the "operator's notebook" feel instead of the standard accordion box.
- No card chrome around each row; just dividers. The whole section feels lighter and more editorial.
- Background stays `#efe7db`.

---

### Files to touch

- `src/pages/Launchpad.tsx` — replace the two section blocks (lines ~206–258 and ~409–452). Add a small local state for the picker's `activeSlug`, `selectedSlugs`, and FAQ `activeCategory`. Tag each FAQ entry with a `category` field.
- No new components required, no data model changes, no DB changes. `ServiceDetailModal` and `LAUNCHPAD_SERVICES` are reused as-is.
- `ContactForm.tsx` already parses `?focus=` — confirm it splits on commas so a multi-select stack pre-checks all matching boxes; if it currently only handles a single slug, update the focus-parsing line to `focus?.split(",")` and pre-check each.

### Out of scope

- Hero, services grid, modals, header, footer, CTA section — untouched.
- No DB migration, no edge function changes.