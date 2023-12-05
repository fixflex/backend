import { NextFunction, Response } from 'express';
import { Request } from 'express';
import asyncHandler from 'express-async-handler';
import jwt, { JwtPayload } from 'jsonwebtoken';

import UserModel from '../DB/models/user/user.model';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { AuthRequest } from '../interfaces/auth.interface';
import { UserType } from '../interfaces/user.interface';

const checkTokenExists = (req: Request) => {
  if (!req.headers.authorization?.startsWith('Bearer')) {
    return;
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return;
  return token;
};

const checkUserExists = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    return;
  }
  return user;
};

const isPasswordChanged = (passwordChangedAt: Date, tokenIssuedAt: number) => {
  if (passwordChangedAt) {
    const changedAt = passwordChangedAt.getTime() / 1000;
    if (changedAt > tokenIssuedAt) {
      return true;
    }
  }
  return false;
};

const authenticateUser = asyncHandler(async (req: AuthRequest, _res: Response, next: NextFunction) => {
  // 1- check if the token exists
  const token = checkTokenExists(req);
  if (!token) {
    return next(new HttpException(401, `You are not authorized, you must login to get access this route`));
  }
  console.log('before verify', token);
  // 2- check if the token is valid
  const decoded = jwt.verify(token!, env.JWT_SECRET_KEY) as JwtPayload;
  console.log(decoded);

  // 3- check if the user still exists
  const user = await checkUserExists(decoded.userId);
  if (!user) {
    return next(new HttpException(401, 'The user that belongs to this token no longer exists'));
  }
  // 4- check if the user changed his password after the token was issued
  if (isPasswordChanged(user.passwordChangedAt, decoded.iat!)) {
    return next(new HttpException(401, 'User recently changed password! Please log in again'));
  }

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
