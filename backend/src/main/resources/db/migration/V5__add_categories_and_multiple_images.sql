CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE subcategories (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE (category_id, name)
);

CREATE TABLE product_images (
    product_id BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    CONSTRAINT fk_product_images FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- Migrate existing images if any
INSERT INTO product_images (product_id, image_url)
SELECT id, image_url FROM products WHERE image_url IS NOT NULL AND image_url != '';

ALTER TABLE products DROP COLUMN image_url;

-- Convert existing string categories/subcategories into the new tables
INSERT INTO categories (name)
SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '';

INSERT INTO subcategories (category_id, name)
SELECT DISTINCT c.id, p.subcategory
FROM products p
JOIN categories c ON c.name = p.category
WHERE p.subcategory IS NOT NULL AND p.subcategory != '';

ALTER TABLE products ADD COLUMN category_id BIGINT;
ALTER TABLE products ADD COLUMN subcategory_id BIGINT;

UPDATE products p
SET category_id = (SELECT id FROM categories c WHERE c.name = p.category),
    subcategory_id = (SELECT s.id FROM subcategories s JOIN categories c ON c.id = s.category_id WHERE s.name = p.subcategory AND c.name = p.category);

ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE products ADD CONSTRAINT fk_products_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL;

ALTER TABLE products DROP COLUMN category;
ALTER TABLE products DROP COLUMN subcategory;