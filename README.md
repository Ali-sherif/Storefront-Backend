# Storefront Backend Project

This is a simple backend API for an online store to handle products, users, orders. It has different endpoints covering all CRUD operations.



This API built with
- `Node.js`:    Back-end JavaScript runtime environment.
- `Express`:    Node.js web application framework.
- `Typescript`: Is JavaScript with syntax for types.
- `PostgreSQL`: As a Database.
- `db-migrate`: For migrations.
- `jsonwebtoken(JWT)`: For users authorization. 
- `Jasmine`:    For Unit testing.
- `ESLint`:     JS linting tool.
- `prettier`:   Code formatting tool.

## Project Setup and Running
By following the instruction below , you will be able to set up and run the project locally on your machine.

### 1. Install project dependencies
``` 
npm install 
```
### 2. Database Setup
You have to create two databases one for development and another for testing.

- open your shell and connect to the default postgres database via psql
    ```
    psql -U postgres
    ```
- create the dev and test database
    ```
    CREATE DATABASE store_dev;
    CREATE DATABASE store_devtest;
    ````

### 3. Environment Setup 
You need to create `.env` file in the root directory and add these environment variables to it. 
```
PORT=3000
NODE_ENV=dev

POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=store_dev
POSTGRES_DB_TEST=store_devtest
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456

BCRYPT_PASSWORD=your-secert-password
SALT_ROUNDS=10
JWT_TOKEN=your-secert-token

```
## Run Locally


### 4. Run the migration
Use one of this commands to run the migrations, to create the tables in the database.
```
   npm run db-migrate:up
   db-migrate up
```
### 5. build type script files
To build type script files, run the following command
```
  npm run build
```
### 6. Testing
Use this command to run the unit tests with jasmin.
```
npm run jasmin
```
### 7. Run build script &  Run migration &  Run build test by one command 
Use this command 
```
npm run test
```

### 8. Running the App
Use this command to run the app in watch mode.
```
npm run start
```
### 9. Code style
To enforces a consistent style that import from .prettierrc.json and .eslintrc.json files
```
  npm run prettier
  npm run lint



