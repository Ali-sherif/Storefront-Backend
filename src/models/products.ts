import db from '../database/index';
import Product from '../types/Product';

class productModel {
  async createProduct(product: Product): Promise<Product | null> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO products(product_name, product_category, product_price)
                   VALUES ($1,$2,$3) RETURNING *;`;
      const result = await connection.query(sql, [
        product.product_name,
        product.product_category,
        product.product_price
      ]);
      connection.release();
      return result.rows[0];
    } catch (err: unknown) {
      throw new Error('cant add product') as Error;
    }
  }

  async getALLProducts(): Promise<Product[] | null> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM products;';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (err) {
      console.log(err as Error);
      throw new Error('cant get products');
    }
  }

  async getProductsByCategory(category: string): Promise<Product[] | null> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM products WHERE product_category=$1;';
      const result = await connection.query(sql, [category]);
      connection.release();
      return result.rows;
    } catch (err) {
      console.log(err as Error);
      throw new Error('cant get products');
    }
  }

  async deleteProduct(product_name: string): Promise<Product | null> {
    try {
      const connection = await db.connect();
      const sql = 'DELETE  FROM products WHERE product_name=$1;';
      const result = await connection.query(sql, [product_name]);
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error('cant delete product');
    }
  }

  async updateProduct(product: Product): Promise<Product | null> {
    try {
      const connection = await db.connect();
      const sql =
        'UPDATE products SET product_price=$1, product_category=$2 WHERE product_name=$3 RETURNING * ;';
      const result = await connection.query(sql, [
        product.product_price,
        product.product_category,
        product.product_name
      ]);
      connection.release();
      return result.rows[0];
    } catch (err) {
      console.log(err as Error);
      throw new Error('cant update product');
    }
  }
}
export default productModel;
