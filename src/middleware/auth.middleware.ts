import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt, { JwtPayload } from 'jsonwebtoken';

import UserModel from '../DB/models/user.model';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { Request } from '../helpers';
import { UserType } from '../interfaces/user.interface';

const checkAccessTokenExists = (req: Request) => {
  // check cookies first then check headers for the token (for the swagger docs)
  let token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
  if (!token || token === 'null') {
    return;
  }
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

const authenticateUser = asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  // 1- check if the token exists
  const token = checkAccessTokenExists(req);
  // console.log('token', token);
  if (!token) {
    return next(new HttpException(401, 'unauthorized'));
  }
  // 2- check if the token is valid
  const decoded = jwt.verify(token!, env.ACCESS_TOKEN_SECRET_KEY) as JwtPayload;

  // 3- check if the user still exists
  const user = await checkUserExists(decoded.userId);
  if (!user) {
    return next(new HttpException(401, 'unauthorized'));
  }
  // 4- check if the user changed his password after the token was issued
  // TODO: make this check in the user model instead of here
  if (isPasswordChanged(user.passwordChangedAt, decoded.iat!)) {
    // iat is the time the token was issued
    return next(new HttpException(401, 'unauthorized'));
  }
  //  // 5- check if the user is active
  if (!user.active) {
    return next(new HttpException(401, 'user_not_active'));
  }

  req.user = user!;
  next();
});

// Authorization (User permissions)
const allowedTo =
  (...roles: UserType[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      return next(new HttpException(403, 'permission_denied'));
    }

    next();
  };

export { authenticateUser, allowedTo };
