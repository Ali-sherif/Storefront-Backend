import UserModel from '../models/users';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import jwtDecode from 'jwt-decode';
import User from '../types/user';
const userModel = new UserModel();

const createToken = (email: string, user_id: number): string => {
  return jwt.sign({ email, user_id }, config.token as string);
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const createdUser = await userModel.createUser(req.body as User);
    const { user_id, email } = createdUser;
    const token: string = createToken(email, user_id as number);
    res.status(200).json({
      status: 'success',
      data: createdUser,
      token,
      message: 'created successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'wrong'
    });
    console.error(err as Error);
  }
};
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userModel.getUserById(
      req.params.id as unknown as number
    );
    res.status(200).json({
      status: 'success',
      data: user,
      message: 'created successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'wrong'
    });
    console.error(err as Error);
  }
};
export const logIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const loggedUser = await userModel.logIn(
      email as string,
      password as string
    );
    if (!loggedUser) {
      res.status(404).json({
        status: 'failed',
        message: 'email or password is wrong'
      });
      return;
    }
    const { user_id, email: user_email } = loggedUser;
    const token: string = createToken(user_email, user_id as number);
    res.status(200).json({
      status: 'success',
      data: loggedUser,
      token,
      message: 'login  successfully'
    });
  } catch (err) {
    console.error(err as Error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loggedUser = await userModel.getAllUsers();

    res.status(200).json({
      status: 'success',
      data: loggedUser,
      message: 'get  successfully'
    });
  } catch (err) {
    console.error(err as Error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const deletedUser = await userModel.deleteUser(
      email as string,
      password as string
    );
    if (!deletedUser) {
      res.status(404).json({
        status: 'failed',
        message: 'email or password is wrong'
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: deletedUser,
      message: 'deleted  successfully'
    });
  } catch (err: unknown) {
    console.error(err as Error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id }: User = jwtDecode(req.body.token);
    req.body.user_id = user_id;
    const updatedUser = await userModel.updateUser(req.body);
    if (!updatedUser) {
      res.status(404).json({
        status: 'failed',
        message: 'email or password is wrong'
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: updatedUser,
      message: 'updated  successfully'
    });
  } catch (err: unknown) {
    console.error(err as Error);
  }
};
