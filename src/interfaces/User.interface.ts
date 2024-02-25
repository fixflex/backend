import { NextFunction } from 'express';
import { Document } from 'mongoose';

import { Request, Response } from '../helpers/generic';

export enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  password: string;
  passwordChangedAt: Date;
  passwordResetCode: string | undefined;
  passwordResetCodeExpiration: number | undefined;
  passwordResetVerified: boolean | undefined;
  role: UserType;
  profilePicture: {
    url: string | null;
    publicId: string | null;
  };
  active: boolean;
  phoneNumber: string;
  // ip address of the user when he registered or logged in
  ipAddress: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserController {
  getUser(req: Request, res: Response, next: NextFunction): void;
  getMe(req: Request, res: Response, next: NextFunction): void;
  updateMe(req: Request, res: Response, next: NextFunction): void;
  deleteMe(req: Request, res: Response, next: NextFunction): void;
  updateMyProfileImage(req: Request, res: Response, next: NextFunction): void;
}

export interface IUserService {
  getUser(userId: string): Promise<IUser | null>;
  createUser(user: IUser): Promise<IUser>;
  updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null>;
  deleteUser(userId: string): Promise<IUser | null>;
  updateProfileImage(userId: string, file: Express.Multer.File): Promise<IUser | null>;
}
