import OrderModel from '../orders';
import UserModel from '../users';
import ProductModel from '../products';
import db from '../../database/index';

import Order from '../../types/order';
import User from '../../types/user';
import Product from '../../types/Product';

const orderModel = new OrderModel();
const userModel = new UserModel();
const productModel = new ProductModel();

describe('OrderModel Tests', () => {
  describe('test if methods exists', () => {
    it('should have an createOrder method', (): void => {
      expect(orderModel.createOrder).toBeDefined();
    });

    it('should have an getActiveOrdersByUserId method', (): void => {
      expect(orderModel.getActiveOrdersByUserId).toBeDefined();
    });

    it('should have an getCompletedOrdersByUserId method', (): void => {
      expect(orderModel.getCompletedOrdersByUserId).toBeDefined();
    });

    it('should have an updateOrderStatus method', (): void => {
      expect(orderModel.updateOrderStatus).toBeDefined();
    });

    it('should have an deleteOrder method', (): void => {
      expect(orderModel.deleteOrder).toBeDefined();
    });
  });

  describe('test if methods work correct', () => {
    const user = {
      email: 'test3@g.com',
      first_name: 'test',
      last_name: 'user',
      password: 'test123'
    } as User;

    const product = {
      product_name: 'laptop',
      product_category: 'electronics',
      product_price: '2000'
    } as Product;

    const order = {
      product_id: product.product_id,
      user_id: user.user_id,
      quantity: 5
    } as Order;

    beforeAll(async (): Promise<void> => {
      const createdUser = await userModel.createUser(user);
      user.user_id = createdUser.user_id;
      const createdProduct = await productModel.createProduct(product);
      product.product_id = createdProduct?.product_id;
      const createOrder = await orderModel.createOrder(order);
      order.order_id = createOrder.order_id;
    });

    afterAll(async (): Promise<void> => {
      const connection = await db.connect();
      const sql = 'DELETE FROM users;';
      await connection.query(sql);
      connection.release();
    });

    it('createOrder method should return a new order', async (): Promise<void> => {
      const newOrder = await orderModel.createOrder({
        user_id: user.user_id,
        product_id: product.product_id,
        quantity: 3
      } as Order);
      expect(newOrder?.order_status).toEqual('active');
      expect(newOrder?.user_id).toEqual(user.user_id as number);
    });

    it('getActiveOrdersByUserId method should return number of active orders for user', async (): Promise<void> => {
      const newOrder = await orderModel.getActiveOrdersByUserId(
        user.user_id as number
      );
      expect(newOrder.length).toEqual(1);
    });

    it('updateOrderStatus method should make an order complete', async (): Promise<void> => {
      const newOrder = await orderModel.updateOrderStatus(
        order.order_id as number
      );
      expect(newOrder?.order_status).toEqual('complete');
    });

    it('getCompletedOrdersByUserId method should return number of completed orders for user', async (): Promise<void> => {
      const newOrder = await orderModel.getCompletedOrdersByUserId(
        user.user_id as number
      );
      expect(newOrder.length).toBe(0);
    });

    it('deleteOrder method should return the all product', async (): Promise<void> => {
      const products = await orderModel.deleteOrder(order.order_id as number);
      expect(products.order_id).toEqual(order.order_id);
    });
  });
});
