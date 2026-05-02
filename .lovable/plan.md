# Replace Display Font: Instrument Serif → Fraunces

## Why
Instrument Serif looks distinctive but its thin strokes and tight letterforms make italic display text hard to scan, especially at large sizes in headings, stats, and the FAQ panel. We need something with the same editorial personality but better legibility.

## Recommended Font: Fraunces
- Modern variable serif with a warm, slightly quirky personality (soft-square terminals, subtle flare)
- Italic remains highly readable at large sizes (unlike Instrument Serif's very thin italics)
- Supports weight + optical size variations for crisp rendering at any scale
- Pairs cleanly with Inter (current body font)
- Used by premium editorial brands — feels custom without sacrificing clarity

(Backup options if you prefer: **Newsreader** — softer, magazine feel; **Source Serif 4** — more conservative/professional. Default in plan is Fraunces.)

## Changes

### 1. `index.html`
Swap the Instrument Serif `<link>` for Fraunces with italic + multiple weights:
```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&display=swap
```

### 2. `tailwind.config.ts`
```ts
serif:   ['"Fraunces"', 'Georgia', 'serif'],
display: ['"Fraunces"', 'Georgia', 'serif'],
```

### 3. Optional micro-tweak per usage
Fraunces italic at very large sizes (e.g., the 7xl/9xl numbers in `HowItWorksProcess` and `ValueProposition`) reads best at weight 400–500. No component rewrites needed — existing `font-display italic` classes will pick up the new font automatically. If any heading feels slightly heavier than before, we can add `font-normal` (already present on most).

## Files Modified
- `index.html` — font link
- `tailwind.config.ts` — `serif` + `display` family stacks

## What Stays the Same
- All `font-display italic` usages across Hero, FAQ, Stats, Reviews, Services, ValueProposition, HowItWorks, LaunchpadCallout, etc. — they automatically inherit Fraunces
- Inter remains the body font
- No layout, color, or copy changes
- Why Choose Us page theme untouched
