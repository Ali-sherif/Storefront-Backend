# API Requirements

You need to have token to can access most of endpoint and you have two ways
1- create a new user by using endpoint :  POST /api/v1/users
 response body will contain a token just copy it and use it when send any request

2- login with exist user by using endpoint :  POST /api/v1/users/login
response body will contain a token just copy it and use it when send any request

## API Endpoints

#### Products
- Create Product

  ```http
  POST /api/v1/products [token required]
```

| request body       | Type     | Description                       |
| :--------          | :------- | :-------------------------------- |
| `product_name`     | `string` | **Required**. name     of product |
| `product_price`    | `string` | **Required**. price    of product |
| `product_category` | `string` | **Required**. category of product |

- getALLProducts

  ```http
  GET /api/v1/products [token required]
```
- getProductsByCategory [token required]

  ```http
  get/api/v1/products/category/:categoryName [token required]
```

| Query item         | Type     | Description                    |
| :--------          | :------- | :------------------------------|
| `categoryName`     | `string` | **Required**. name of category |

- Delete Product

  ```http
  DELETE /api/v1/products [token required]
```

| request body       | Type     | Description                       |
| :--------          | :------- | :-------------------------------- |
| `product_name`     | `string` | **Required**. name     of product |

```
- Update Product

  ```http
  PUT /api/v1/products [token required]
```

| request body       | Type     | Description                       |
| :--------          | :------- | :-------------------------------- |
| `product_name`     | `string` | **Required**. name     of product |
| `product_price`    | `string` | **Required**. price    of product |
| `product_category` | `string` | **Required**. category of product |

```
#### Users
- createUser 

  ```http
  POST /api/v1/users 
```

| request body  | Type     | Description                    |
| :--------     | :------- | :----------------------------- |
| `email`       | `string` | **Required**.  user email      |
| `first_name`  | `string` | **Required**.  user first name |
| `last_name`   | `string` | **Required**.  user last name  |
| `password`    | `string` | **Required**.  user password   |

```
- Log IN

  ```http
  POST /api/v1/users/login
```

| request body  | Type     | Description                    |
| :--------     | :------- | :----------------------------- |
| `email`       | `string` | **Required**.  user email      |
| `password`    | `string` | **Required**.  user password   |
```
- getAllUsers

  ```http
  GET /api/v1/users [token required]
```
- Delete User

  ```http
  DELETE /api/v1/users [token required]
```

- Update User

  ```http
  PUT/api/v1/users [token required]
| request body  | Type     | Description                    |
| :--------     | :------- | :----------------------------- |
| `email`       | `string` | **Required**.  user email      |
| `first_name`  | `string` | **Required**.  user first name |
| `last_name`   | `string` | **Required**.  user last name  |
| `password`    | `string` | **Required**.  user password   |
```

#### Orders

- Create Order

  ```http
  POST /api/v1/orders [token required]
| request body  | Type     | Description               |
| :--------     | :------- | :-------------------------|
| `product_id`  | `string` | **Required**.  product ID |
| `quantity`    | `number` | **Required**.  Quantity   |
```

- getActiveOrdersByUserId

  ```http
  GET /api/v1/orders/active/:userId [token required]
| Query item     | Type     | Description              |
| :--------      | :------- | :------------------------|
| `userID`       | `string` | **Required**. user id    |

```

- getCompletedOrdersByUserId

  ```http
  GET /api/v1/orders/completed/:userId [token required]
| Query item     | Type     | Description              |
| :--------      | :------- | :------------------------|
| `userID`       | `string` | **Required**. user id    |

```

- UpdateOrderStatus

  ```http
  PUT /api/v1/orders/:orderId [token required]
| Query item     | Type     | Description            |
| :--------      | :------- | :----------------------|
| `orderID`      | `string` | **Required**. order id |


- DeleteOrder

  ```http
  DELETE /api/v1/orders/:orderId [token required]
| Query item     | Type     | Description            |
| :--------      | :------- | :----------------------|
| `orderID`      | `string` | **Required**. order id |
```

## Data Shapes
#### Product
- product_id
- product_name 
- product_price 
- product_category 

#### User
- user_id
- first_name 
- last_name
- password
- joined_date 
- email 
#### Orders
- order_id 
- user_id REFERENCES users(user_id)
- order_status  DEFAULT 'active'
- order_date  
#### order_products
- order_product_id
- order_id REFERENCES order(order_id) 
- product_id  
- quantity 

## Database Schema

#### Products table
CREATE TABLE products(
product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
product_price VARCHAR ( 10 ) NOT NULL ,
product_name VARCHAR ( 100 ) NOT NULL,
product_category VARCHAR ( 50) NOT NULL	
);

#### Users table
CREATE TABLE users(
user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
first_name VARCHAR ( 25 ) NOT NULL ,
last_name VARCHAR ( 25 ) NOT NULL,
email VARCHAR ( 50 ) UNIQUE NOT NULL,
password VARCHAR ( 250) NOT NULL,
joined_date TIMESTAMP  NOT NULL
);


#### Orders table
CREATE TABLE orders(
order_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
order_status VARCHAR ( 20 ) NOT NULL DEFAULT 'active',
order_date DATE  NOT NULL
);

#### Orders_products table
CREATE TABLE order_products(
order_product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
quantity INTEGER NOT NULL,
order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
product_id INT REFERENCES products(product_id) ON DELETE CASCADE
);

