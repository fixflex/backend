import { NextFunction, Response } from 'express';
import { Request } from 'express';
import asyncHandler from 'express-async-handler';
import jwt, { JwtPayload } from 'jsonwebtoken';

import UserModel from '../DB/models/user/user.model';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { AuthRequest } from '../interfaces/auth.interface';
import { UserType } from '../interfaces/user.interface';

const checkTokenExists = (req: Request, next: NextFunction) => {
  if (!req.headers.authorization?.startsWith('Bearer')) {
    return next(new HttpException(401, `You are not authorized, you must login to get access this route`));
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return;
  return token;
};

const checkUserExists = async (userId: string, next: NextFunction) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new HttpException(401, 'The user that belongs to this token no longer exists'));
  }
  return user;
};

const authenticateUser = asyncHandler(async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = checkTokenExists(req, next);
  if (!token) {
    // throw next(new HttpException(500, 'Auth Failed (Invalid Credentials)'));
    return;
  }
  const decoded = jwt.verify(token!, env.JWT_SECRET_KEY) as JwtPayload;
  const user = await checkUserExists(decoded.userId, next);
  req.user = user!;
  next();
});

// Authorization (User permissions)
const allowedTo =
  (...roles: UserType[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      return next(new HttpException(403, `You are not allowed to perform this action`));
    }

    next();
  };

export { authenticateUser, allowedTo };
