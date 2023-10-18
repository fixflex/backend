import { NextFunction, Response } from 'express';
import { Request } from 'express';
import asyncHandler from 'express-async-handler';
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '../DB/models/user/client.model';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { AuthRequest } from '../interfaces/auth.interface';

const checkTokenExists = (req: Request, next: NextFunction) => {
  if (!req.headers.authorization?.startsWith('Bearer')) {
    return next(
      new HttpException(401, `You are not authorized, you must login to get access this route`)
    );
  }

  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(
      new HttpException(401, `You are not authorized, you must login to get access this route`)
    );
  }

  return token;
};

const checkUserExists = async (userId: string, next: NextFunction) => {
  const user = await User.findById(userId);

  if (!user) {
    return next(new HttpException(401, 'The user that belongs to this token no longer exists'));
  }

  return user;
};

const authenticateUser = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token = checkTokenExists(req, next);
    const decoded = jwt.verify(token!, env.JWT_SECRET_KEY) as JwtPayload;
    const user = await checkUserExists(decoded.userId, next);
    req.user = user!;
    next();
  }
);

// Authorization (user permissions)
const allowedTo =
  (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      return next(new HttpException(403, `You are not allowed to perform this action`));
    }

    next();
  };

export { authenticateUser, allowedTo };
