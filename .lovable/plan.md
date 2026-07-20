## Goal
Add all 12 FAQPage JSON-LD schemas (one per category) into the `<head>` of `/faq`, matching the schemas provided in the PDF.

## Approach
The `faqCategories` array in `src/pages/FAQ.tsx` already contains all questions/answers verbatim matching the PDF schemas. Rather than hardcoding 12 duplicate blocks, generate one JSON-LD `<script>` per category dynamically inside the existing `<Helmet>` block.

## Change
In `src/pages/FAQ.tsx`, inside the existing `<Helmet>` (lines 501–518), append:

```tsx
{faqCategories.map((cat, i) => (
  <script key={i} type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": `${cat.title} FAQs`,
      "mainEntity": cat.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": { "@type": "Answer", "text": q.answer }
      }))
    })}
  </script>
))}
```

This emits 12 separate FAQPage schemas (Getting Started, General Operations, Shipping & Receiving, Shopify & DTC, Amazon FBA, TikTok Shop, Pricing & Payment, Turnaround Times, Quality Control, Location & Logistics, Insurance & Security, Special Handling) covering every Q&A in the PDF, since react-helmet-async supports children `<script>` tags and hoists them into `<head>`.

## Verification
Load `/faq`, inspect `document.head` for 12 `script[type="application/ld+json"]` blocks with `@type: FAQPage`.
