# Make the site easy for AI to find and understand

## What I verified on the live site

Checked every public page the way a bot reads it (no JavaScript, raw server output).

**Working:**
- AI bots (ChatGPT, Claude, Perplexity) get full pages back, not blank shells. Your rules file lets them in.
- All 49 blog posts appear in the sitemap and render their text server-side, with article, author, breadcrumb and FAQ summaries.
- The FAQ page ships 12 question-and-answer summaries; the reviews page ships a rating summary.

**Broken:**
- 28 of your 30 public pages send AI no fact sheet at all: homepage, pricing, 3PL, sales channels, all service pages, contact, blog listing. An AI asked "what does Westfield charge and where are they" has to guess from prose.
- Your AI guide file (`llms.txt`, live at westfieldprepcenter.com/llms.txt) lists 30 of your 74 pages. 44 of 49 blog posts are missing from it.
- One link in that file points to a blog post that no longer exists. It returns a 13 KB empty page with the homepage title, which search engines treat as a soft 404.
- Two different public emails are published in different places: `info@westfieldprepcenter.com` on your contact page, `info@westfieldprep.com` in the blog summaries.
- Your new "built for large-scale brands" homepage copy is in the preview but not live yet.
- No company profile page exists, so AI has no single authoritative source to quote about who you are.

## What I will build

1. **Company profile page at `/about`** — light Technical Editorial styling, one H1, written so an AI can quote it directly: who you serve, where you are, what you do, how pricing works, how to start.
2. **Fact sheets on all 28 missing pages** — the machine-readable summary each page already describes in prose, moved into the HTML that bots actually receive.
3. **AI guide file rebuilt** — every one of your 74 pages listed with a one-line summary, plus a company facts block at the top that AI tools read first. A fuller companion file with the complete fact sheet and FAQ text for tools that want depth.
4. **One contact email everywhere** — `info@westfieldprepcenter.com`.
5. **Dead link removed** from the AI guide file.
6. **Verify, then publish on your go-ahead.**

## What visitors will see

Nothing changes visually except the new `/about` page. No headline, price, meta title or existing page copy gets rewritten.

## Decisions and notes

- Header, footer and logo stay untouched per your standing rule. The new `/about` page gets linked from inside existing page bodies instead of the footer.
- I will not invent company facts. The page uses only numbers already published on your site: Los Angeles, CA; 1.818.935.5478; info@westfieldprepcenter.com; $1.00–$2.50 per unit; 2M+ orders shipped; built for brands doing 1,000+ orders a month. Send me facility size, year founded or team size if you want those included.
- Your reviews page publishes a star-rating summary built from your own testimonials. Google's guidelines discourage ratings a business publishes about itself. I am leaving it live as-is and flagging it; say the word and I will pull it.
- The SEO checker currently reports no failing findings, so this work is about AI comprehension, not fixing a broken scan.

## Technical details

- **The mechanism that works here:** TanStack Start route `head()` accepts `scripts: [{ type: "application/ld+json", children }]`, which renders into the raw HTML. Confirmed by `/faq` (12 blocks) and `/blog/$slug` (3 blocks).
- **Why 28 pages emit nothing:** `src/components/StructuredData.tsx` injects its JSON-LD through `react-helmet-async`, which does not run during server rendering. `src/pages/Index.tsx` renders four of those components and the homepage HTML contains zero JSON-LD.
- **New module `src/data/pageSchemas.ts`:** one builder per route, reusing the schema definitions already written in `StructuredData.tsx` (organization, service, faq, breadcrumb, collectionPage, itemList, product, contact, localBusiness, software).
- **Shared data:** `serviceData` and `faqData` arrays currently defined inside page components move into the schema module so the route and the visible page read from one source of truth.
- **No duplicates:** `StructuredData.tsx` becomes a no-op returning null, so the browser does not inject a second copy of each block after hydration.
- **Routes to update:** index, pricing, 3pl-los-angeles, amazon-fba-prep, shopify-fulfillment, tiktok-shop-fulfillment, walmart-fulfillment, sales-channels plus its three channel pages, integrations, why-choose-us, launchpad, contact, storage-warehousing, order-fulfillment, inventory-management, kitting-bundling, labeling-compliance, labeling-fnsku, receiving-inspection, returns-processing, service-breakdown, services, platforms, west-coast-fulfillment, blog, privacy, terms.
- **New files:** `src/routes/about.tsx`, `src/pages/About.tsx`, plus AboutPage / LocalBusiness / Organization schema and sitemap and guide-file entries.
- **Email fix:** `src/lib/blogSchemas.ts` and `src/components/blog/BlogPostSchema.tsx`.
- **Guide file:** rebuild `public/llms.txt` from `public/sitemap.xml` so all 74 URLs appear; drop the dead `/blog/shopify-prep-center-fulfillment-guide` entry (no row in `blog_posts`, live URL returns a soft 404). Add `public/llms-full.txt`.
- **Verification:** crawler-user-agent sweep over every public route comparing JSON-LD block counts before and after; clean build log; new `/about` page renders and its schema appears in raw HTML. Then publish, which also brings the large-scale brands homepage live.
