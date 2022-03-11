import supertest from 'supertest';
import app from '../../index';
import db from '../../database';
import UserModel from '../../models/users';
import User from '../../types/user';

const userModel = new UserModel();
const request = supertest(app);
let token = '';

describe('User API Endpoints', () => {
  const user = {
    email: 'test4@g.com',
    first_name: 'test',
    last_name: 'user',
    password: 'test123'
  } as User;

  beforeAll(async (): Promise<void> => {
    const createUser = await userModel.createUser(user);
    user.user_id = createUser.user_id;
  });

  afterAll(async (): Promise<void> => {
    const connection = await db.connect();
    const sql = 'DELETE FROM users;';
    await connection.query(sql);
    connection.release();
  });

  describe('Test authenticate to send back token', () => {
    it('should be able to login correctly', async () => {
      const response = await request
        .post('/api/v1/users/login')
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
    it('should not to login because email not found', async () => {
      const response = await request
        .post('/api/v1/users/login')
        .set('Content-type', 'application/json')
        .send({
          email: 'fakeEmail@g.com',
          password: 'test123'
        });
      expect(response.status).toBe(404);
    });
  });

  describe('Test CRUD API Methods', () => {
    it('should be able to create user', async () => {
      const response = await request
        .post('/api/v1/users/')
        .set('Content-type', 'application/json')
        .send({
          email: 'test5@g.com',
          password: 'test123',
          first_name: 'test',
          last_name: 'user'
        } as User);
      const { email, first_name, last_name } = response.body.data;
      expect(email).toBe(email);
      expect(first_name).toBe(first_name);
      expect(last_name).toBe(last_name);
      expect(response.status).toBe(200);
    });

    it('should be able to get all users', async () => {
      const response = await request
        .get('/api/v1/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should be able to get userById', async () => {
      const response = await request
        .get(`/api/v1/users/${user.user_id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should be able to update user', async () => {
      const response = await request
        .put('/api/v1/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'a12@g.com',
          password: '12345678',
          first_name: 'killing',
          last_name: 'eve'
        });
      console.log();
      expect(response.status).toBe(200);
    });

    it('should be able to delete user', async () => {
      const response = await request
        .delete('/api/v1/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'a12@g.com',
          password: '12345678'
        });
      expect(response.status).toBe(200);
    });
  });
});
