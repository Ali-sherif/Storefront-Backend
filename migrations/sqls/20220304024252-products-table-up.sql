/* Replace with your SQL commands */
CREATE TABLE products(
product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
product_price VARCHAR ( 10 ) NOT NULL ,
product_name VARCHAR ( 100 ) NOT NULL,
product_category VARCHAR ( 50) NOT NULL	
);
