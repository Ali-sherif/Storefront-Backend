import UserModel from '../users';
import User from '../../types/user';
import db from '../../database/index';

const userModel = new UserModel();

describe('UserModel Tests', () => {
  describe('test if methods exists', () => {
    it('should have an create method', (): void => {
      expect(userModel.createUser).toBeDefined();
    });

    it('should have an logIn method', (): void => {
      expect(userModel.logIn).toBeDefined();
    });

    it('should have an delete method', (): void => {
      expect(userModel.deleteUser).toBeDefined();
    });

    it('should have an update method', (): void => {
      expect(userModel.updateUser).toBeDefined();
    });

    it('should have a getUserById method', (): void => {
      expect(userModel.getUserById).toBeDefined();
    });
  });

  describe('test if methods work correct', () => {
    const user = {
      email: 'test@g.com',
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

    it('create method should return a new user', async (): Promise<void> => {
      const { email, first_name, last_name }: User = await userModel.createUser(
        {
          email: 'tes2t@g.com',
          first_name: 'test2',
          last_name: 'user',
          password: 'test123'
        }
      );
      expect({ email, first_name, last_name }).toEqual({
        email: 'tes2t@g.com',
        first_name: 'test2',
        last_name: 'user'
      } as User);
    });

    it('getUserById method should return a user ', async (): Promise<void> => {
      const getUser = await userModel.getUserById(user.user_id as number);
      expect(getUser).not.toBeNull();
    });

    it('logIN method should return the authenticated user', async (): Promise<void> => {
      const authenticatedUser = await userModel.logIn(
        user.email,
        user.password as string
      );
      expect(authenticatedUser?.email).toBe(user.email);
      expect(authenticatedUser?.first_name).toBe(user.first_name);
      expect(authenticatedUser?.last_name).toBe(user.last_name);
    });

    it('logIN method should return null for wrong data', async (): Promise<void> => {
      const authenticatedUser = await userModel.logIn(
        'fakeEmail@g.com',
        'fakePassword'
      );
      expect(authenticatedUser).toBe(null);
    });

    it('update method should return user with specific id ', async (): Promise<void> => {
      const updatedUser = await userModel.updateUser({
        user_id: user.user_id,
        first_name: 'ali',
        last_name: 'sherif',
        email: 'newMail@g.com',
        password: '45678950'
      } as User);
      expect(updatedUser?.user_id).toBe(user.user_id);
      expect(updatedUser?.email).toBe('newMail@g.com');
      expect(updatedUser?.first_name).toBe('ali');
      expect(updatedUser?.last_name).toBe('sherif');
    });

    it('delete method should return  user with specific id ', async (): Promise<void> => {
      const deletedUser = await userModel.deleteUser(
        'newMail@g.com',
        '45678950'
      );
      expect(deletedUser?.user_id).toBe(user.user_id);
    });
  });
});
