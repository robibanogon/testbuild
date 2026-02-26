-- Drop tables if they exist
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    image_url VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(50),
    shipping_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Smartphones', 'Latest smartphones and mobile devices'),
('Laptops', 'Laptops and notebooks for work and gaming'),
('Tablets', 'Tablets and iPad devices'),
('Accessories', 'Phone cases, chargers, and other accessories'),
('Wearables', 'Smartwatches and fitness trackers');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity) VALUES
('iPhone 15 Pro', 'Latest iPhone with A17 Pro chip and titanium design', 999.99, 1, 'https://via.placeholder.com/300x300?text=iPhone+15+Pro', 50),
('Samsung Galaxy S24', 'Flagship Android phone with AI features', 899.99, 1, 'https://via.placeholder.com/300x300?text=Galaxy+S24', 45),
('MacBook Pro 14"', 'Powerful laptop with M3 chip for professionals', 1999.99, 2, 'https://via.placeholder.com/300x300?text=MacBook+Pro', 30),
('Dell XPS 15', 'Premium Windows laptop with stunning display', 1599.99, 2, 'https://via.placeholder.com/300x300?text=Dell+XPS+15', 25),
('iPad Air', 'Versatile tablet with M1 chip', 599.99, 3, 'https://via.placeholder.com/300x300?text=iPad+Air', 60),
('Samsung Galaxy Tab S9', 'Android tablet with S Pen included', 549.99, 3, 'https://via.placeholder.com/300x300?text=Galaxy+Tab+S9', 40),
('Apple Watch Series 9', 'Advanced smartwatch with health tracking', 399.99, 5, 'https://via.placeholder.com/300x300?text=Apple+Watch', 70),
('AirPods Pro', 'Wireless earbuds with active noise cancellation', 249.99, 4, 'https://via.placeholder.com/300x300?text=AirPods+Pro', 100),
('USB-C Fast Charger', '65W fast charging adapter', 29.99, 4, 'https://via.placeholder.com/300x300?text=USB-C+Charger', 200),
('Phone Case Premium', 'Protective case with elegant design', 19.99, 4, 'https://via.placeholder.com/300x300?text=Phone+Case', 150);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Made with Bob
