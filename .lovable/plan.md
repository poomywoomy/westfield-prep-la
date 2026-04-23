

## Plan: Add "Warehousing and Fulfillment" Blog Post (Image in Supabase Storage)

### Goal
Add the new blog post from the PDF, with the cover image uploaded to the Supabase **`blog-images`** public bucket (matching the URL format you referenced: `https://gqnvkecmxjijrxhggcro.supabase.co/storage/v1/object/public/blog-images/{filename}.jpg`) — not stored locally in `/public/blog-images/`.

### Cover image
- Source: page 1 hero image from the PDF (warehouse worker in yellow hard hat with clipboard).
- Upload to Supabase bucket `blog-images` as: `warehousing-and-fulfillment-warehouse-worker.jpg`
- Final public URL stored in `blog_posts.cover_image_url`:
  ```
  https://gqnvkecmxjijrxhggcro.supabase.co/storage/v1/object/public/blog-images/warehousing-and-fulfillment-warehouse-worker.jpg
  ```

### Blog post metadata (from PDF, exact)
| Field | Value |
|---|---|
| `title` | Warehousing and Fulfillment for Fast Growing Online Brands |
| `slug` | `warehousing-and-fulfillment-efficient-order-handling` |
| `meta_description` | Warehousing and fulfillment solutions for fast growing online brands. Speed up deliveries, simplify inventory tracking, and scale operations with ease. |
| `category` | Fulfillment |
| `tags` | warehousing and fulfillment, fulfillment center Los Angeles, ecommerce fulfillment, order handling, 3PL Los Angeles, multi-channel fulfillment |
| `cover_image_url` | Supabase public URL above |
| `author_name` | Westfield Team |
| `published` | true |
| `read_time_minutes` | 5 |

### Required hyperlinks (per your instructions)
1. **Introduction** — phrase *"warehousing and fulfillment"* → `https://westfieldprepcenter.com/storage-warehousing`
2. **The Advantage of a Fulfillment Center in Los Angeles** — phrase *"a fulfillment center los angeles"* → `https://westfieldprepcenter.com/shopify-fulfillment`

No other links added — content stays exactly as the PDF.

### Content structure (matches PDF section-for-section, verbatim)
- H2 Introduction
- H3 What is Warehousing and Fulfillment?
- H3 Why Efficient Order Handling Matters
- H3 Key Components of a Strong Fulfillment System (4 numbered subsections)
- H2 The Advantage of a Fulfillment Center in Los Angeles
- H2 Transparency and Cost Control
- H2 Scalability Without Limitations
- H2 Multi-Channel Fulfillment Made Easy
- H2 Technology and Real-Time Visibility
- H2 Building a Reliable Fulfillment Strategy
- H2 Why Location and Efficiency Go Hand in Hand
- H2 FAQs (5 collapsible `<details>` items, exact PDF wording)

### FAQ schema
The 5 FAQs are added as `<details><summary>` blocks. The site's existing `BlogPostSchema.tsx` automatically generates the `FAQPage` JSON-LD schema from these blocks — no manual schema work needed, and it will match the schema in the PDF appendix.

### Execution steps (default mode)
1. Copy the PDF page-1 image from `parsed-documents://` → `/tmp/`, then upload to Supabase Storage bucket `blog-images` as `warehousing-and-fulfillment-warehouse-worker.jpg` (public, `cache-control: 31536000`).
2. Create `docs/blog-posts/warehousing-and-fulfillment-efficient-order-handling.md` with the verbatim PDF content + the two required hyperlinks + the FAQ `<details>` blocks. Frontmatter `cover_image_url` points to the Supabase public URL.
3. Run a Supabase migration that `INSERT`s the row into `public.blog_posts` with `published = true`, `published_at = now()`, idempotent via `ON CONFLICT (slug) DO UPDATE`.

### Files affected
- **New** `docs/blog-posts/warehousing-and-fulfillment-efficient-order-handling.md`
- **New asset in Supabase Storage** `blog-images/warehousing-and-fulfillment-warehouse-worker.jpg`
- **New migration** inserting the post into `blog_posts`

### Out of scope
- No code changes to `BlogPostSchema.tsx` (FAQ JSON-LD already auto-generated from `<details>` blocks).
- No edits to existing blog posts, `/blog` listing, or routing.
- No local `/public/blog-images/` copy — image lives only in Supabase per your request.
- No content rewriting — PDF content is reproduced as-is.

