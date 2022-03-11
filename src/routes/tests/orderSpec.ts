import supertest from 'supertest';
import app from '../../index';
import db from '../../database';
import ProductModel from '../../models/products';
import Product from '../../types/Product';
import UserModel from '../../models/users';
import User from '../../types/user';
import Order from '../../types/order';
import OrderModel from '../../models/orders';

const userModel = new UserModel();
const productModel = new ProductModel();
const orderModel = new OrderModel();
const request = supertest(app);
let token = '';
const user = {
  email: 'test7@g.com',
  first_name: 'test',
  last_name: 'user',
  password: 'test123'
} as User;

const product = {
  product_category: 'electronics',
  product_name: 'camera',
  product_price: '2000'
} as Product;

describe('Product API Endpoints', () => {
  const order = {
    user_id: user.user_id,
    quantity: 2,
    product_id: product.product_id
  } as Order;

  beforeAll(async (): Promise<void> => {
    const createProduct = await productModel.createProduct(product);
    product.product_id = createProduct?.product_id;
    const createUser = await userModel.createUser(user);
    user.user_id = createUser.user_id;
    const createOrder = await orderModel.createOrder(order);
    order.order_id = createOrder.order_id;
  });

  afterAll(async (): Promise<void> => {
    const connection = await db.connect();
    const sql =
      'DELETE FROM products; DELETE FROM users; DELETE FROM orders; DELETE FROM order_products;';
    await connection.query(sql);
    connection.release();
  });

  describe('Test authenticate to send back token', () => {
    it('should be able to login correctly', async () => {
      const response = await request
        .post('/api/v1/users/login/')
        .set('Content-type', 'application/json')
        .send({
          email: 'test7@g.com',
          password: 'test123'
        });
      expect(response.status).toBe(200);
      const { token: userToken } = response.body;
      const { user_id, email } = response.body.data;
      expect(user_id).toBe(user.user_id);
      expect(email).toBe('test7@g.com');
      token = userToken;
    });
    describe('Test CRUD API Methods', () => {
      it('should be able to create order', async () => {
        const response = await request
          .post('/api/v1/orders/')
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({
            user_id: user.user_id,
            quantity: 2,
            product_id: product.product_id
          } as Order);
        expect(response.status).toBe(200);
      });

      it('should be able to get active orders by user id', async () => {
        const response = await request
          .get(`/api/v1/orders/active/${user.user_id}`)
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      });

      it('should be able to get completed orders by user id', async () => {
        const response = await request
          .get(`/api/v1/orders/completed/${user.user_id}`)
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
      });

      it('should be able to update order status to be complete', async () => {
        const response = await request
          .put(`/api/v1/orders/${order.order_id}`)
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`);
        const { order_status } = response.body.data;
        expect(response.status).toBe(200);
        expect(order_status).toBe('complete');
      });

      it('should be able to delete order', async () => {
        const response = await request
          .delete(`/api/v1/orders/${order.order_id}`)
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });
    });
  });
});
