# Simplify navigation while preserving AI discoverability

## Goal
Make the main menu clearer without hiding useful pages from search engines or AI assistants.

## Changes
1. **Simplify the main menu**
   - Remove **Testimonials** and **Why Choose Us** from both desktop and mobile header navigation.
   - Keep both links in the footer Quick Links section.
   - Keep both pages live at their existing URLs, with their current content and metadata unchanged.

2. **Rename the pricing link**
   - Change **See Your Savings** to **Pricing** in desktop and mobile navigation.
   - Keep it pointing to `/pricing`.

3. **Preserve AI and search visibility**
   - Keep Testimonials and Why Choose Us in the XML sitemap, `llms.txt`, and `llms-full.txt`.
   - Preserve relevant contextual links from other page content so AI crawlers can understand how these pages relate to Westfield's services. “Footer only” will apply to global navigation placement, not useful in-content citations.
   - Verify all public sitemap URLs remain represented in the AI-readable files and remove any dead or mismatched references found during the check.
   - Confirm representative pages return complete server-rendered text, metadata, and structured data without requiring browser interaction.

4. **Verification**
   - Check desktop and mobile navigation behavior.
   - Confirm the footer links still open the correct pages.
   - Confirm `/pricing`, `/testimonials`, and `/why-choose-us` render correctly.
   - Check the build and current preview errors before completion.

## Boundaries
- No page copy, existing metadata titles, page URLs, header styling, footer styling, or logo changes.
- No publishing until explicitly requested.
