# West Coast Fulfillment Page: Light "Technical Editorial" Restyle

Keep every word of the current content and all 16 sections. Change only the visual language, moving the page from a generic dark-hero layout to a bright, print-inspired operations document.

## The look

A light paper page with navy ink and orange as a precision accent. Think a printed port timetable or an engineering data sheet: thin rules, numbered section markers, monospaced figures, generous whitespace, and no heavy colored blocks.

- Backgrounds: warm off-white (#FDFDFD) and pure white, alternating in wide bands. No dark sections anywhere on this page.
- Ink: Midnight Navy for headings and body, with softened opacities for secondary text.
- Orange: hairlines, index numbers, key figures, and hover tints only. Never a full background fill except on the primary buttons.
- A monospaced face (JetBrains Mono) joins Inter for codes, figures, and labels.

## Section-by-section changes

1. **Hero** (currently dark navy, centered). Becomes light and left-aligned: an orange hairline plus a monospaced eyebrow ("West Coast Operations // Los Angeles, CA"), a tight oversized two-line headline where the second line is outlined type rather than solid, the existing subhead at reading width, and the two existing CTAs (solid navy primary, outlined secondary). Closed by a full-width hairline rule.
2. **Metrics strip.** Becomes a four-cell hairline grid with `[01]`–`[04]` orange monospaced indices above each figure and small-caps labels beneath.
3. **Jump navigation.** Stays sticky but flattens to underlined monospaced uppercase links on paper, with an orange active state instead of pill chips.
4. **Transit time table.** Heavier top rule, uppercase hairline header row, monospaced transit figures in orange, a thin capability bar per row, and a faint orange hover tint. The right-hand column gains a compact status label.
5. **Ports, shipping zones, container timeline, services, Amazon FBA, how to choose, peak season, glossary.** Each gets a numbered section marker and hairline-bordered white cards with squared corners replacing the current soft rounded shadow cards.
6. **East vs West comparison** (currently a dark navy band). Converts to the same paper treatment with a hairline comparison matrix, keeping the copy and all three columns.
7. **FAQ.** Two-column editorial layout of questions with orange-underlined headings, keeping every existing question, answer, and the FAQ schema intact.
8. **Final CTA** (currently dark navy). Becomes a light band with a heavy top rule, the headline in navy, and the same buttons.

## Technical notes

- Work stays inside `src/pages/WestCoastFulfillment.tsx` and its local subcomponents. No route, data, or schema changes.
- New tokens go into `src/index.css` (paper, hairline, ink-soft, mono-accent) and `tailwind.config.ts` (mono font family), so nothing is hardcoded in the component.
- JetBrains Mono is added as a font link in `index.html` alongside the existing Inter load.
- Header, Footer, and Logo are untouched, per the standing constraint.
- Single H1 preserved; heading hierarchy, internal links, meta tags, and JSON-LD stay exactly as they are.
- Motion stays restrained: hairline reveals on scroll and row hover states only.
