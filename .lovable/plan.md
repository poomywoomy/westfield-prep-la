

## Plan: Create New Blog Post from PDF

### What We're Building
A new blog post based on the uploaded PDF "How to Grow Your Business with a Prep Center for Amazon FBA", rewritten in Westfield's conversational style with proper SEO, internal links, interactive elements, and FAQs.

### Content Strategy

**Meta Data:**
- Title: `Prep Center for Amazon FBA to Grow Your Ecommerce Business`
- Meta Description: `Westfield Prep Center offers prep center for Amazon FBA with fast processing, accurate labeling, and scalable fulfillment solutions for growing brands.`
- Slug: `prep-center-for-amazon-fba-grow-ecommerce-business`
- Category: `Amazon FBA`

**Required Hyperlinks (from user):**
1. "prep center for Amazon FBA" → `https://westfieldprepcenter.com/amazon-fba-prep`
2. "los angeles fulfillment center" → `https://westfieldprepcenter.com`
3. "order fulfillment solutions" → `https://westfieldprepcenter.com/order-fulfillment`

**Additional Internal Links (per blog guidelines, 6-8 total):**
4. "Westfield Prep Center" → homepage
5. "Contact us today" → `/contact`
6. "pricing" or related → `/pricing`
7. "Shopify fulfillment" → `/shopify-fulfillment`
8. "labeling and compliance" → `/labeling-compliance`

**Interactive Elements (3-4 collapsible sections):**
- Cost comparison calculator
- Checklist for choosing a prep center
- Before/after scenario

**FAQs:** 5 questions from the PDF, formatted with `<details>/<summary>` tags for automatic FAQPage schema generation.

### Steps

1. **Save cover image** from extracted PDF image to `public/blog-images/`
2. **Create markdown file** at `docs/blog-posts/prep-center-for-amazon-fba-grow-ecommerce-business.md` with rewritten content (conversational style, no em dashes, E-E-A-T signals, keyword density)
3. **Insert blog post into database** via the `import-blog-post` edge function or direct SQL insert with all frontmatter fields
4. **Update sitemap** in `public/sitemap.xml` with the new blog URL
5. **Verify** the post renders correctly at `/blog/prep-center-for-amazon-fba-grow-ecommerce-business`

### Technical Details
- Content stored in `blog_posts` table (slug, title, content, meta_description, category, tags, etc.)
- BlogPostSchema component auto-generates Article + FAQPage JSON-LD from `<details>` blocks
- BlogPostRenderer converts markdown to styled HTML

