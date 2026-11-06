# Make business figures and hours consistent site-wide

## Approved figures (single source of truth)
- Orders shipped: **2 million annually** (never "lifetime", never "2M+ units")
- Brands served: **75+**
- Order accuracy: **99.8%**
- Same-day shipping rate: **97%**
- Hours: **8 a.m.–5 p.m. PT, Monday–Friday** (five days)
- Same-day cutoff: **2 p.m. PT**

## What the scan found (about 96 files mention these topics)
- Accuracy conflicts: 99.2% (Shopify trust bar, Shopify value grid), 99.5% (FAQ page, FAQ PDF), 99.7% (Why Choose Us).
- Order volume: "2M+" used loosely on Why Choose Us, Pricing, Integrations, West Coast page, ROI report PDF; some say units or lifetime.
- Brands: mixes of "100+" and "500+".
- Hours: footer says "Open 7 Days a Week"; some FAQs mention 5 PM.
- Cutoff: written as "2 PM PST" (wrong half the year), "2PM PST", "2 PM PT".
- Same-day rate: 97% not shown consistently.
- "4.9" rating on home page has no source (will flag, not remove, unless you say so).

## Steps
1. Save the six figures as a permanent project rule so future pages and blogs use them.
2. Create one shared figures file; update stats strips, heroes, trust bars, footer, About, Pricing, Why Choose Us, channel pages, FAQ page, FAQ schemas (search-engine data in page heads), chatbot knowledge, and PDF generators (FAQ, ROI report, agreements) to use it.
3. Fix wording: "2 million orders shipped annually", "2 p.m. PT", "Mon–Fri, 8 a.m.–5 p.m. PT".
4. Update AI guide files (llms.txt, llms-full.txt) and structured data opening hours (Mon–Fri 08:00–17:00).
5. Scan blog posts in the database for conflicting figures and correct them (excluding cited third-party stats, e.g. port TEU numbers).
6. Re-scan everything and spot-check key pages in the browser; deliver a short list of every change.

## Not changed
- Third-party statistics with citations.
- Page titles/meta descriptions unless they contain a wrong figure.
- Header, footer layout, and logo (text only).
