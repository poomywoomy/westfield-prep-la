## Problem

At ~1765px viewport the header row overflows past the container. `nav` (8 links with `gap-8` + `whitespace-nowrap`) plus the CTA cluster (phone + Schedule a Call + Get a Quote + LanguageSwitcher with `ml-6` and `gap-4`) is wider than the container, so the "Get a Quote" button gets clipped on the right edge. No page has `overflow-x: hidden`, so it visibly bleeds off-screen.

## Fix (Header.tsx only)

Tighten the desktop header so it fits comfortably at 1280–1920px without touching Footer, Logo, or unrelated components.

1. **Reduce nav spacing** — change `<nav className="hidden lg:flex items-center gap-8">` to `gap-6` at lg and `gap-8` only at 2xl (`lg:gap-6 2xl:gap-8`).
2. **Tighten CTA cluster** — change `hidden xl:flex items-center gap-4 ml-6` to `hidden xl:flex items-center gap-3 ml-4 2xl:gap-4 2xl:ml-6`.
3. **Reduce outer row gap** — change the row `flex items-center justify-between gap-6` to `gap-4 2xl:gap-6`.
4. **Compact CTA buttons at xl** — add `xl:px-3 2xl:px-4` (and matching text sizing if needed) to the Schedule a Call and Get a Quote buttons so both fit at xl breakpoints; keep full padding at 2xl.
5. **Safety net** — add `overflow-x-hidden` to the `<header>` element so any residual overflow can never clip past the viewport.

No copy changes, no logic changes, no layout restructure. Mobile/tablet menu untouched.

## Verification

- Screenshot the `/contact` route at 1280, 1440, 1600, 1765, 1920 widths via Playwright and confirm the "Get a Quote" button is fully visible and nothing wraps.