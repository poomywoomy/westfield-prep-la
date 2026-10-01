# Audit and fix unindexed blog posts

## Goal
Find which blog posts Google has not indexed (or crawled), improve the weak ones, and give the user a manual checklist for requesting indexing — since indexing requests can only be made by the user in Search Console, not by the site.

## What the data already shows
- Homepage: "Submitted and indexed", last crawled Sep 29, 2026. Mobile-first.
- Many blog posts ARE indexed: they show impressions in Search Console (e.g. /blog/8-professional-fulfillment-services-small-companies: 3,433 impressions; /blog/3pl-for-amazon-fba-vs-ecommerce-fulfillment-centers: 364).
- Bigger issue than indexing: /3pl-los-angeles has 6,475 impressions at position ~37 with almost zero clicks; several posts rank at position 13-26 with near-zero CTR.

## Plan

### 1. Index-status audit (read-only, live Google data)
- List every blog post from the live sitemap.
- Run URL Inspection (POST /v1/urlInspection/index:inspect) through the connected Search Console property for each post URL.
- Classify each: Indexed / Crawled not indexed / Discovered not crawled / Not found / Error.
- Deliver a table to the user.

### 2. Fix the unindexed or weak posts (site changes)
For each post that is "Crawled not indexed" or thin:
- Strengthen the section that Google indexed least: sharpen the intro so the primary keyword ("3PL", "prep center", "fulfillment service Los Angeles") appears in the first 100 words.
- Add 1-2 internal links FROM high-authority pages (homepage, /3pl-los-angeles) TO the weak post, and links from the weak post to related posts — internal linking is the strongest lever for getting pages crawled and indexed.
- Verify the post appears in sitemap.xml with a current lastmod date.
- Do NOT change meta titles or published content the user already approved unless the post is confirmed unindexed.
- Update sitemap lastmod dates for edited posts.

### 3. Improve click-through on already-indexed pages (optional, separate pass)
- /3pl-los-angeles and top blog posts ranking 13-26: suggest title and meta description rewrites that earn clicks without changing the page content or H1s. These will be proposed for approval before applying, since the user has standing rules about not changing metadata without review.

### 4. Manual request-indexing checklist for the user
- After the fixes are published, give the user a short list of the specific URLs to open in Google Search Console → URL Inspection → Request Indexing, prioritized by business value.
- Note: the API cannot submit indexing requests; this step is manual by design.

## Constraints
- No changes to meta titles or approved content of indexed posts without explicit approval.
- No sitemap resubmission except after content changes (one submission, after the batch).
- Never describe URL Inspection as requesting a re-crawl — it only reads status.
