import { Request as ExpressRequest, NextFunction } from 'express';

import { Request, Response } from '../helpers/generic';
import { IUser } from './';

export interface AuthRequest extends ExpressRequest {
  user?: IUser;
}

export interface IAuthController {
  signup(req: Request, res: Response, next: NextFunction): void;
  login(req: Request, res: Response, next: NextFunction): void;
  logout(req: Request, res: Response, next: NextFunction): void;
  googleLogin(req: Request, res: Response, next: NextFunction): void;
  refreshToken(req: Request, res: Response, next: NextFunction): void;
  forgotPassword(req: Request, res: Response, next: NextFunction): void;
  verifyPassResetCode(req: Request, res: Response, next: NextFunction): void;
  resetPassword(req: Request, res: Response, next: NextFunction): void;
  changePassword(req: Request, res: Response, next: NextFunction): void;
}

export interface IAuthService {
  signup(data: IUser): Promise<any>;
  login(email: string, password: string): Promise<any>;
  googleLogin(credential: any): Promise<any>;
  refreshToken(refreshToken: string): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  verifyPassResetCode(resetCode: string): Promise<any>;
  resetPassword(resetCode: string, password: string): Promise<any>;
  changePassword(payload: { oldPassword: string; newPassword: string }, user: IUser): Promise<{ token: string }>;
}
