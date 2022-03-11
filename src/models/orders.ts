import db from '../database/index';
import Order from '../types/order';

class OrderModel {
  async createOrder(order: Order): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO orders(user_id, order_date) 
                     VALUES ($1,NOW()) returning *;`;
      const result = await connection.query(sql, [order.user_id]);
      const { order_id } = result.rows[0];
      const sql2 = `INSERT INTO order_products(quantity, order_id, product_id) 
                     VALUES ($1,$2,$3) returning *;`;
      await connection.query(sql2, [
        order.quantity,
        order_id,
        order.product_id
      ]);

      connection.release();
      return result.rows[0];
    } catch (err: unknown) {
      console.error(err);
      throw Error('cant create order') as Error;
    }
  }

  async getActiveOrdersByUserId(user_id: number): Promise<Order[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM orders WHERE user_id =$1 AND order_status ='active';`;
      const result = await connection.query(sql, [user_id]);
      connection.release();
      return result.rows;
    } catch (err: unknown) {
      console.error(err as Error);
      throw new Error('Could not get active order.');
    }
  }

  async getCompletedOrdersByUserId(user_id: number): Promise<Order[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM orders WHERE user_id =$1 AND order_status ='completed';`;
      const result = await connection.query(sql, [user_id]);
      connection.release();
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Could not get completed order.');
    }
  }

  async updateOrderStatus(id: number): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = `update orders set order_status='complete' WHERE order_id=$1 returning *;`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (err: unknown) {
      console.error(err);
      throw Error('cant update order') as Error;
    }
  }

  async deleteOrder(id: number): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = 'DELETE FROM orders WHERE order_id=$1 RETURNING *; ';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (err: unknown) {
      throw Error('cant delete order') as Error;
    }
  }
}
export default OrderModel;
