-- Restore products falsely marked as archived/inactive
UPDATE skus
SET 
  status = 'active',
  notes = CASE 
    WHEN notes = '(Archived: Deleted from Shopify)' THEN NULL
    WHEN notes LIKE '%Archived: Deleted from Shopify%' THEN REPLACE(notes, '(Archived: Deleted from Shopify)', '')
    ELSE notes
  END
WHERE notes LIKE '%Archived: Deleted from Shopify%';