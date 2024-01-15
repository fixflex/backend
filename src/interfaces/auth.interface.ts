import { Request, Response } from 'express';

import { IUser } from './user.interface';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface IAuthController {
  signup(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  googleLogin(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  verifyPassResetCode(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  getProfile(req: Request, res: Response): Promise<void>;
}

export interface IAuthService {
  signup(data: any): Promise<any>;
  login(email: string, password: string): Promise<any>;
  googleLogin(credential: any): Promise<any>;
  refreshToken(refreshToken: string): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  verifyPassResetCode(resetCode: string): Promise<any>;
  resetPassword(resetCode: string, password: string): Promise<any>;
}

export interface IAuthRepository {
  signup(data: any): Promise<any>;
  login(email: string): Promise<any>;
  googleLogin(email: string): Promise<any>;
  refreshToken(refreshToken: string): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  verifyPassResetCode(resetCode: string): Promise<any>;
  resetPassword(resetCode: string, password: string): Promise<any>;
}
