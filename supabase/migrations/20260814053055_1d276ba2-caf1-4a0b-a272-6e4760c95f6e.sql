UPDATE public.blog_posts
SET content = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        content,
        'That''s why so many <a href="https://maps.app.goo.gl/n88ChGHJ8QrW16M58">ecommerce companies in Los Angeles</a> choose to base their operations here',
        'That''s why so many ecommerce companies in Los Angeles choose to base their operations here'
      ),
      'Whether you''re an Amazon seller looking for a <a href="https://westfieldprepcenter.com/blog/prep-center-for-amazon-fba-grow-ecommerce-business">prep center for Amazon FBA</a>, a Shopify store owner',
      'Whether you''re an Amazon seller looking for a prep center for Amazon FBA, a Shopify store owner'
    ),
    'A prep center for Amazon FBA located in Los Angeles helps sellers meet these requirements quickly',
    'A <a href="https://westfieldprepcenter.com/blog/prep-center-for-amazon-fba-grow-ecommerce-business">prep center for Amazon FBA</a> located in Los Angeles helps sellers meet these requirements quickly'
  ),
  'It''s also home to a large and growing number of ecommerce companies in Los Angeles, ranging from small startups',
  'It''s also home to a large and growing number of <a href="https://maps.app.goo.gl/n88ChGHJ8QrW16M58">ecommerce companies in Los Angeles</a>, ranging from small startups'
),
updated_at = NOW()
WHERE slug = 'why-los-angeles-smart-base-ecommerce-companies-3pls';