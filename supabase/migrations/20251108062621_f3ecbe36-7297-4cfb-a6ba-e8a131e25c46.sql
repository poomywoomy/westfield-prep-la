-- Add dimension columns to skus table for shipping calculations
ALTER TABLE skus 
ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS length DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS width DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS height DECIMAL(10,2);

COMMENT ON COLUMN skus.weight IS 'Weight in ounces for shipping calculations';
COMMENT ON COLUMN skus.length IS 'Length in inches for shipping calculations';
COMMENT ON COLUMN skus.width IS 'Width in inches for shipping calculations';
COMMENT ON COLUMN skus.height IS 'Height in inches for shipping calculations';