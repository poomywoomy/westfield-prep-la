# Simplify the Materials Pricing Setup

## Goal
Make material entry faster, denser, and easier to scan without changing the generated PDF, saved data, totals, or available options.

## Changes
- Replace the large card around every material with a compact table-style editor.
- Use one slim row per material with clear columns for Material, Size, Unit, Price, Quantity, and actions.
- Keep the optional notes field hidden by default behind a small note icon or expandable row, reducing empty space.
- Show the custom material name only when Custom is selected and keep Size available only for the same supported materials as today.
- Tighten control heights, labels, gaps, and borders while retaining readable type and comfortable click targets.
- Keep Add Material visible near the table and keep delete as a compact icon action with a tooltip.
- Retain the live summary, but make it narrower and denser so the material editor has more working room.
- Stack fields cleanly on smaller screens instead of forcing the desktop table width.

## Behavior Preserved
- Existing client and prospect selection.
- All current material choices, units, defaults, prices, quantities, notes, comments, and total calculations.
- Save, reopen, edit, delete, cancel, and PDF download flows.
- The current Materials Pricing PDF generator and its visual design will not be modified.

## Verification
- Create rows for every material type, including Custom and materials without Size.
- Add, edit, expand notes, remove, save, reopen, and download a sample document.
- Confirm totals and saved values remain unchanged.
- Compare the downloaded PDF with the current version and confirm its layout is unchanged.
- Check the setup screen at desktop and mobile widths and confirm the project build remains clean.
