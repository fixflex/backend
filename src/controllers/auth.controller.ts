import { CookieOptions } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import env from '../config/validateEnv';
import { UserDto } from '../dtos/user.dto';
import customResponse from '../helpers/customResponse';
import { Request, Response } from '../helpers/generic';
import { IUser } from '../interfaces';
import { IAuthController } from '../interfaces/auth.interface';
import { AuthServie } from '../services/auth.service';

// TODO: use passport.js for authentication
@autoInjectable()
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthServie) {}

  private accessTokenCookieOptions: CookieOptions = {
    httpOnly: true, // client side js cannot access the cookie
    maxAge: 30 * 24 * 60 * 60 * 1000, // one month
    secure: env.NODE_ENV !== 'development', // cookie only works in https
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', // sameSite is none if secure is true and lax if secure is false because we are using cors and we are not using csrf protection
  };

  private refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true, // client side js cannot access the cookie
    maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    secure: env.NODE_ENV !== 'development', // cookie only works in https
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', // sameSite is none if NODE_ENV is production and lax if NODE_ENV is development because we are using cors and we are not using csrf protection
    path: '/api/v1/auth/refresh-token',
  };

  public signup = asyncHandler(async (req: Request<IUser>, res: Response) => {
    let { user, accessToken, refreshToken } = await this.authService.signup(req.body);

    res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
    res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);

    res.status(201).json({ data: new UserDto(user), success: true, status: 201, message: 'User created', error: false });
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    let { email, password } = req.body;
    let { user, accessToken, refreshToken } = await this.authService.login(email, password);

    res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
    res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);

    res.status(200).json({ data: new UserDto(user), success: true, status: 200, message: 'User logged in', error: false });
  });

  public logout = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');

    res.status(200).json({ data: null, success: true, status: 200, message: 'User logged out', error: false });
  });

  public googleLogin = asyncHandler(async (req: Request, res: Response) => {
    let { credential } = req.body;
    let { user, accessToken, refreshToken } = await this.authService.googleLogin(credential);

    res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
    res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);

    res.status(200).json({ data: new UserDto(user), success: true, status: 200, message: 'User logged in', error: false });
  });

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json(customResponse({ data: null, success: false, status: 401, message: 'You are not authorized, you must login to get access this route', error: true }));
      return;
    }
    let { accessToken } = await this.authService.refreshToken(refreshToken);

    res.cookie('access_token', accessToken, this.accessTokenCookieOptions);

    res.status(200).json({ data: null, success: true, status: 200, message: 'Access token refreshed', error: false });
  });

  public forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    let { email } = req.body;
    await this.authService.forgotPassword(email);
    res.status(200).json(customResponse({ data: null, success: true, status: 200, message: 'Password reset done sent to email!, please check your email inbox', error: false }));
  });

  public verifyPassResetCode = asyncHandler(async (req: Request, res: Response) => {
    let { resetCode } = req.body;
    await this.authService.verifyPassResetCode(resetCode);
    res.status(200).json(customResponse({ data: null, success: true, status: 200, message: 'Password reset code verified', error: false }));
  });

  public resetPassword = asyncHandler(async (req: Request, res: Response) => {
    let { email, newPassword } = req.body;
    let results = await this.authService.resetPassword(email, newPassword);

    res.cookie('access_token', results.accessToken, this.accessTokenCookieOptions);
    res.cookie('refresh_token', results.refreshToken, this.refreshTokenCookieOptions);

    res.status(200).json({ data: new UserDto(results.user), success: true, status: 200, message: 'Password reset done', error: false });
  });
}
