-- Update blog_posts for shopify-3pl-los-angeles with missing links and metadata
UPDATE blog_posts 
SET 
  content = replace(content, 
    'If you''re scaling a Shopify store, LA isn''t just a "good" place to fulfill orders. It''s strategically one of the best regions in the entire country.',
    'If you''re scaling a Shopify store, LA isn''t just a "good" place to fulfill orders. It''s strategically one of the best regions in the entire country. Many sellers are also exploring <a href="/amazon-prep-services">Amazon Prep Services</a> as Amazon phases out direct prep support.'
  ),
  content = replace(content,
    '<p>Most general 3PLs use UPS Ground as their default carrier. The average UPS Ground transit time from Los Angeles to major metros is:</p>',
    '<p>Most general 3PLs use UPS Ground as their default carrier. According to the <a href="https://www.fedex.com/en-us/service-guide.html" target="_blank" rel="noopener noreferrer">FedEx Service Guide</a>, FedEx offers competitive transit times from LA as well. The average UPS Ground transit time from Los Angeles to major metros is:</p>'
  ),
  content = replace(content,
    'USPS LA district has some of the highest first scan performance ratings',
    'USPS LA district has some of the highest first scan performance ratings according to the <a href="https://facts.usps.com" target="_blank" rel="noopener noreferrer">USPS Performance Dashboard</a>'
  ),
  content = replace(content,
    'This is consistent with industry data reported by the U.S. Census ecommerce report',
    'This is consistent with industry data reported by the <a href="https://www.census.gov/retail/mrts/www/data/pdf/ec_current.pdf" target="_blank" rel="noopener noreferrer">U.S. Census ecommerce report</a>'
  ),
  meta_description = 'LA''s top Shopify 3PL providing same-day receiving, 24 to 48 hour fulfillment, real-time Shopify syncing, and no minimums. Get your free Shopify fulfillment audit today.',
  tags = ARRAY['Shopify 3PL', 'Los Angeles fulfillment', 'Shopify fulfillment center', 'DTC fulfillment', 'ecommerce logistics', 'West Coast 3PL', 'Shopify warehouse', 'LA prep center', 'real-time inventory sync', 'fast fulfillment']
WHERE slug = 'shopify-3pl-los-angeles';
