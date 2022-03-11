import jwt from 'jsonwebtoken';
import config from '../config';
import { Request, Response, NextFunction } from 'express';
const validateTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get('authorization');
    if (authHeader) {
      const bearer = authHeader.split(' ')[0].toLowerCase();
      const token = authHeader.split(' ')[1];
      if (token && bearer === 'bearer') {
        const decode = jwt.verify(token, config.token as unknown as string);
        if (decode) {
          req.body.token = token;
          next();
        } else {
          res.statusCode = 401;
          res.end('failed to authenticate user');
        }
      } else {
        res.statusCode = 401;
        res.end('token type not bearer');
      }
    } else {
      res.statusCode = 401;
      res.end('no token provided');
    }
  } catch (error) {
    res.statusCode = 401;
    res.end('ERROR');
  }
};

export default validateTokenMiddleware;
