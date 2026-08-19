# Fix: header sub-menu hidden behind the hero banner

## Problem

The "Sales Channels" (and other) dropdown menus open inside the fixed header, but the header itself has a horizontal-overflow clip applied to it. A clip on one axis also clips the other axis, so the dropdown panel gets cut off / appears to sit behind the hero banner instead of floating over it.

## Fix

1. Remove the overflow clipping from the `<header>` element in `src/components/Header.tsx`, so dropdown panels can extend below the header bar.
2. Keep the original horizontal-scroll protection (added earlier to stop the page clipping on the right) by moving it to the page wrapper instead of the header.
3. Make the dropdown panel layering explicit: the navigation menu wrapper gets its own stacking context and the dropdown content/viewport sits above the hero (z-index above the header's own level).

## Files touched

- `src/components/Header.tsx` — drop `overflow-x-hidden` from the header element; add explicit stacking/z-index to the `NavigationMenu` wrapper.
- `src/components/ui/navigation-menu.tsx` — give the dropdown viewport container a z-index so it renders above hero content on every page.
- Global styles (`src/styles.css`) — apply the horizontal overflow guard at the page/body level so nothing else regresses.

## Out of scope

No changes to menu items, labels, links, hero content, or any metadata.

## Verification

Open the homepage and hover "Sales Channels" plus any other dropdown: the panel should render fully over the hero banner with no clipping, and the page should still have no horizontal scrollbar at desktop and mobile widths.
