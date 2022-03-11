import supertest from 'supertest';
import app from '../../index';
import db from '../../database';
import ProductModel from '../../models/products';
import Product from '../../types/Product';
import UserModel from '../../models/users';
import User from '../../types/user';

const userModel = new UserModel();
const productModel = new ProductModel();
const request = supertest(app);
let token = '';
const user = {
  email: 'test4@g.com',
  first_name: 'test',
  last_name: 'user',
  password: 'test123'
} as User;

describe('Product API Endpoints', () => {
  const product = {
    product_category: 'electronics',
    product_name: 'computer',
    product_price: '2000'
  } as Product;

  beforeAll(async (): Promise<void> => {
    const createProduct = await productModel.createProduct(product);
    product.product_id = createProduct?.product_id;
    const createUser = await userModel.createUser(user);
    user.user_id = createUser.user_id;
  });

  afterAll(async (): Promise<void> => {
    const connection = await db.connect();
    const sql = 'DELETE FROM products; DELETE FROM users;';
    await connection.query(sql);
    connection.release();
  });

  describe('Test authenticate to send back token', () => {
    it('should be able to login correctly', async () => {
      const response = await request
        .post('/api/v1/users/login/')
        .set('Content-type', 'application/json')
        .send({
          email: 'test4@g.com',
          password: 'test123'
        });
      expect(response.status).toBe(200);
      const { token: userToken } = response.body;
      const { user_id, email } = response.body.data;
      expect(user_id).toBe(user.user_id);
      expect(email).toBe('test4@g.com');
      token = userToken;
    });
    describe('Test CRUD API Methods', () => {
      it('should be able to create product', async () => {
        const response = await request
          .post('/api/v1/products/')
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({
            product_category: 'electronics',
            product_name: 'playstation',
            product_price: '3000'
          } as Product);
        const { product_name, product_category, product_price } =
          response.body.data;
        expect(product_name).toBe('playstation');
        expect(product_category).toBe('electronics');
        expect(product_price).toBe('3000');
        expect(response.status).toBe(200);
      });

      it('should be able to get all products', async () => {
        const response = await request
          .get('/api/v1/products/')
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      });

      it('should be able to get getProductsByCategory', async () => {
        const categoryName = 'electronics';
        const response = await request
          .get(`/api/v1/products/category/${categoryName}`)
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      });

      it('should be able to update product', async () => {
        const response = await request
          .put('/api/v1/products/')
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({
            product_category: 'electronics',
            product_name: 'playstation',
            product_price: '4000'
          } as Product);
        const { product_price } = response.body.data;
        expect(response.status).toBe(200);
        expect(product_price).toBe('4000');
      });

      it('should be able to delete product', async () => {
        const response = await request
          .delete('/api/v1/products/')
          .set('Content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({
            product_name: 'playstation'
          });
        expect(response.status).toBe(200);
      });
    });
  });
});
