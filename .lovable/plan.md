# Fix: main menu dropdown not appearing correctly on hover

## Problem

When hovering a main-menu item with a sub-menu (e.g. "Sales Channels"), the dropdown panel does not display cleanly over the page. Two things cause this:

1. The fixed header clips overflow, so a panel that extends below the header bar gets cut off.
2. The dropdown viewport has no explicit z-index of its own, so hero/banner content can paint over it.

## Fix

1. Remove the overflow clipping from the `<header>` element so the hover panel can extend below the header bar, and keep the horizontal-scroll protection by applying it at the page/body level instead.
2. Give the navigation menu wrapper its own stacking context and put the dropdown viewport above the header layer, so the panel always floats over the banner.
3. Confirm the panel anchors directly under its trigger and stays open while the pointer moves from the trigger into the panel.

## Files touched

- `src/components/Header.tsx` — drop `overflow-x-hidden` from the header; add explicit stacking/z-index to the `NavigationMenu` wrapper.
- `src/components/ui/navigation-menu.tsx` — add a z-index to the dropdown viewport container so it renders above page content everywhere.
- Global styles (`src/styles.css`) — page-level horizontal overflow guard so the earlier right-edge clipping fix is preserved.

## Out of scope

No changes to menu items, labels, links, hero/banner content, or any metadata.

## Verification

On the homepage, hover each menu item that has a sub-menu: the panel renders fully over the banner, anchored under its trigger, and stays open while moving the mouse into it. Page still has no horizontal scrollbar at desktop and mobile widths.
