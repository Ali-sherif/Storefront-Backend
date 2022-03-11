import db from '../database/index';
import config from '../config';
import User from '../types/user';
import bcrypt from 'bcrypt';

const hashedPassword = (password: string): string => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};

class userModel {
  async createUser(user: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO users(email, password, first_name, last_name, joined_date) VALUES (($1),($2),($3),($4),NOW()) 
          RETURNING user_id, email, first_name, last_name, joined_date ;`;
      const result = await connection.query(sql, [
        user.email,
        hashedPassword(user.password),
        user.first_name,
        user.last_name
      ]);
      connection.release();
      return result.rows[0] as User;
    } catch (error: unknown) {
      throw new Error('cant create user') as Error;
    }
  }
  async getUserById(id: number): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql =
        'SELECT first_name, last_name, email  FROM users WHERE user_id=$1;';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (err) {
      console.log(err as Error);
      throw new Error('cant get products');
    }
  }
  async logIn(email: string, password: string): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = 'select password from users where email=$1;';
      const result = await connection.query(sql, [email]);
      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashPassword
        );
        if (isPasswordValid) {
          const result = await connection.query(
            `SELECT user_id, email, first_name, last_name FROM users WHERE
          email=($1);`,
            [email]
          );
          connection.release();
          return result.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (err: unknown) {
      throw new Error('email or password is wrong') as Error;
    }
  }

  async getAllUsers(): Promise<User[] | null> {
    try {
      const connection = await db.connect();
      const sql =
        'SELECT email, first_name, last_name, joined_date FROM users;';
      const result = await connection.query(sql);
      if (result) {
        connection.release();
        return result.rows as User[];
      }
      return null;
    } catch (err: unknown) {
      throw new Error('email or password is wrong') as Error;
    }
  }

  async deleteUser(email: string, password: string): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT password FROM users WHERE email=$1;';
      const result = await connection.query(sql, [email]);
      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashPassword
        );
        if (isPasswordValid) {
          const result = await connection.query(
            'DELETE FROM users where email=$1 RETURNING user_id, email, first_name, last_name, joined_date;',
            [email]
          );
          connection.release();
          return result.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (err: unknown) {
      console.error(err as Error);
      throw new Error('email or password is wrong') as Error;
    }
  }

  async updateUser(user: User): Promise<User | null> {
    try {
      const { email, password, first_name, last_name, user_id } = user;
      const connection = await db.connect();
      const result = await connection.query(
        'UPDATE  users SET email=$1, password=$2, first_name=$3, last_name=$4 where user_id=$5 RETURNING user_id, email, first_name, last_name, joined_date ;',
        [email, hashedPassword(password), first_name, last_name, user_id]
      );
      connection.release();
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err: unknown) {
      throw new Error('email or password is wrong') as Error;
    }
  }
}
export default userModel;
