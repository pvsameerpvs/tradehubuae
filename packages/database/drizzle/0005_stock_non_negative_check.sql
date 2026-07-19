-- Add CHECK constraints to prevent negative stock values across all stock columns

ALTER TABLE catalog.products
  ADD CONSTRAINT products_stock_check CHECK (stock >= 0);

ALTER TABLE catalog.product_variants
  ADD CONSTRAINT product_variants_stock_check CHECK (stock >= 0);

ALTER TABLE inventory.stock
  ADD CONSTRAINT stock_quantity_check CHECK (quantity >= 0);
