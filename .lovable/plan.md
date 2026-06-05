# Publish "Amazon FBA Prep Center vs DIY" Blog Post

Add the uploaded PDF content as a published blog post, verbatim, with the requested hero/meta setup, hyperlinks, cover image, and FAQ schema.

## 1. Cover image upload
- Copy the page-1 hero image (man on floor with boxes) from the parsed PDF into the project, then upload it to the existing public `blog-images` Cloud storage bucket at:
  `amazon-fba-prep-center-vs-diy-time-and-cost-compared.jpg`
- Use the resulting public URL as the post's `cover_image_url`.

## 2. Hero + meta handling
- `title` field = **"Amazon FBA Prep Center vs DIY: Save Time and Money"** (the PDF meta title). This renders as the hero H1 and feeds the meta `<title>`.
- `meta_description` = the PDF meta description ("Compare Amazon FBA prep centers and DIY methods…").
- The first content section heading will be **"Amazon FBA Prep Center vs DIY: Time and Cost Compared"** used in place of the "Introduction" heading, immediately followed by the intro paragraphs.

## 3. Content (verbatim from PDF, markdown)
Reproduce all sections in order exactly as written:
- Intro (under the new first heading)
- Understanding Amazon FBA Preparation
- What Is a DIY Amazon Prep Process?
- What Is an Amazon FBA Prep Center?
- Time Comparison (DIY / Prep Center)
- Cost Comparison (DIY / Prep Center / Winner)
- Accuracy and Compliance Comparison
- Scalability Comparison
- Integration with Shopify and Amazon Fulfillment
- Why Los Angeles Is a Strategic Fulfillment Location
- Which Option Is Best?
- Conclusion

### Required hyperlinks (inline)
- Introduction: anchor text **prep centers for amazon fba** → `https://westfieldprepcenter.com/sales-channels/amazon`
- "What Is an Amazon FBA Prep Center?" section: anchor text **West Coast 3PL warehouse** → `https://westfieldprepcenter.com/3pl-los-angeles`
- "Integration with Shopify and Amazon Fulfillment" section: anchor text **shopify amazon fulfillment** → `https://westfieldprepcenter.com/blog/shopify-amazon-fulfillment-scale-ecommerce-brands`

## 4. FAQ + schema
- Add the 5 FAQs as collapsible `<details><summary>` blocks at the end of the content. The existing `BlogPostSchema` component auto-detects `<details>/<summary>` pairs and emits valid `FAQPage` JSON-LD, so no manual schema script is needed — the schema will match the 5 Q&As from the PDF.

## 5. Database insert
Insert one row into `blog_posts` via a data change:
- `slug`: `amazon-fba-prep-center-vs-diy-time-and-cost-compared`
- `title`, `meta_description`, `excerpt`, `content`, `cover_image_url` as above
- `category`: "Amazon FBA"
- `tags`: ["amazon fba prep", "prep center", "3pl", "fulfillment"]
- `published`: true, `published_at`: now
- `author_name`: "Westfield Prep Team", standard `author_bio`
- `read_time_minutes`: calculated from word count

## Technical notes
- No new components needed; `BlogPost.tsx`, `BlogPostRenderer`, and `BlogPostSchema` already render markdown, inline links, collapsible FAQs, and FAQ JSON-LD.
- Slug confirmed not currently in use; `blog-images` bucket exists and is public.
- After publishing, the post is reachable at `/blog/amazon-fba-prep-center-vs-diy-time-and-cost-compared`.
