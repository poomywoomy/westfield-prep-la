# West Coast Fulfillment Landing Page

## Why this page

You already rank top-4 for the whole "west coast fulfillment" cluster, but on a blog post. The SERP shows why that's leaving money on the table — every competitor around you uses a dedicated service page:

| # | Who | Their URL |
|---|---|---|
| 1 | CDL Logistics | `/west-coast/fulfillment-services/` |
| 2 | Novex | `/west-coast-fulfillment-services/` |
| **3** | **You** | **`/blog/west-coast-ecommerce-fulfillment-center-same-day-shipping`** |
| 4 | FulfillPlus | `/west-coast.html` |
| 7 | ShipBob | `/shipbob-locations/usa/west-coast/` |
| 8 | Speed Commerce | `/fulfillment-centers/west-coast-3pl/` |

You are the only non-service-page in the top 10. Keyword difficulty for this cluster is **4–13/100** and aggregate volume is roughly **3,000 searches/month**, with CPCs up to $14.46 — meaning competitors pay real money for this intent.

The searcher typing "west coast fulfillment **companies**" is building a vendor shortlist. Right now they land on an article and leave.

## The page

New route `/west-coast-fulfillment`, built as a genuine service/location page — not a rewritten blog post.

**Target terms:** west coast fulfillment center, west coast fulfillment services, west coast 3PL, west coast ecommerce fulfillment companies, west coast order fulfillment

### Section structure

1. **Hero** — H1 "West Coast Fulfillment Services" with the LA-port angle as the differentiator. Primary CTA to `/contact`, secondary to `/pricing`.
2. **Trust bar** — the existing operational proof points (2M+ units, same-day turnaround, 100+ brands).
3. **Transit-time map/table** — the highest-value block on the page and what the ranking competitors all have. Ground-shipping days from LA to each West Coast + Mountain state. This is the concrete "why West Coast" answer.
4. **Why a West Coast 3PL** — port proximity (LA/Long Beach), reduced zone-skipping, lower West Coast shipping cost, faster inbound on imported containers.
5. **What we handle** — DTC pick & pack, Amazon FBA prep, storage, kitting, returns. Each links to its existing service page (internal-link equity).
6. **Channels** — Shopify / Amazon / TikTok Shop, linking to `/sales-channels/*`.
7. **West Coast vs East Coast comparison** — checkmark/X table, reusing the existing comparison pattern from `/3pl-los-angeles`.
8. **Built for 1,000+ orders/month** — consistent with current positioning; a sweet spot, not a hard floor.
9. **FAQ accordion** — 6–8 questions targeting the question-intent variants, wired to FAQ schema.
10. **Final CTA.**

### Technical

- Reuse the `/3pl-los-angeles` page pattern: `Helmet` + `generateMetaTags`, `Breadcrumbs`, `StructuredData type="organization" | "service" | "faq"`, `TranslatedText` wrapping, `Header`/`Footer` untouched.
- Single H1, kebab-case URL, no trailing slash.
- Register the route in `src/App.tsx` and add the entry to `public/sitemap.xml`.
- Design tokens only — Midnight Navy / Orange, no hardcoded color utilities.

### Link plumbing (this part matters as much as the page)

- Point the existing West Coast blog post's internal links at the new page, so the article feeds the ranking service page instead of competing with it.
- Add a link from `/3pl-los-angeles` (currently 2,322 impressions and 1 click at position 33.7) and from the Footer's services column.
- Cross-link from the other West Coast-themed blog posts already on the site.

### Deliberately not touching

Blog content beyond the internal links above, the ROI calculator, Header, Footer layout, and Logo.

## What I expect from it

The cluster is already won on rankings — this converts existing page-one impressions into inquiries rather than chasing new traffic. It also gives the West Coast keywords a page whose format matches searcher intent, which typically improves position further against the blog post.

I'd treat the trailing-slash duplicate on `/why-choose-us/` and the low-CTR title rewrites as a separate, smaller follow-up.
