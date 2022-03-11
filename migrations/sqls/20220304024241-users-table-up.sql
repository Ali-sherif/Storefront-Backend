/* Replace with your SQL commands */
CREATE TABLE users(
user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
first_name VARCHAR ( 25 ) NOT NULL ,
last_name VARCHAR ( 25 ) NOT NULL,
email VARCHAR ( 50 ) UNIQUE NOT NULL,
password VARCHAR ( 250) NOT NULL,
joined_date TIMESTAMP  NOT NULL
);