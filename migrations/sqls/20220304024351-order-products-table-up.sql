/* Replace with your SQL commands */
CREATE TABLE order_products(
order_product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
quantity INTEGER NOT NULL,
order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
product_id INT REFERENCES products(product_id) ON DELETE CASCADE
);