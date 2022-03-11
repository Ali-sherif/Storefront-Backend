/* Replace with your SQL commands */

CREATE TABLE orders(
order_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
order_status VARCHAR ( 20 ) NOT NULL DEFAULT 'active',
order_date DATE  NOT NULL
);
