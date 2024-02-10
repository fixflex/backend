import { CookieOptions } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import env from '../config/validateEnv';
import { UserDto } from '../dtos';
import { customResponse } from '../helpers';
import { Request, Response } from '../helpers';
import { IUser } from '../interfaces';
import { IAuthController } from '../interfaces';
import { AuthServie } from '../services';

// TODO: use passport.js for authentication
@autoInjectable()
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthServie) {}
  // TODO: return the access token in the response body additionally to the cookie
  private accessTokenCookieOptions: CookieOptions = {
    httpOnly: true, // client side js cannot access the cookie
    maxAge: 30 * 24 * 60 * 60 * 1000, // one month
    secure: env.NODE_ENV !== 'development', // cookie only works in https (secure is true if NODE_ENV is production and false if NODE_ENV is development)
    // signed: true,
    sameSite: env.NODE_ENV !== 'development' ? 'none' : 'lax', // sameSite is none if secure is true and lax if secure is false because we are using cors and we are not using csrf protection
  };

  private refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true, // client side js cannot access the cookie
    maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    secure: env.NODE_ENV !== 'development', // cookie only works in https
    sameSite: env.NODE_ENV !== 'development' ? 'none' : 'lax', // sameSite is none if NODE_ENV is production and lax if NODE_ENV is development because we are using cors and we are not using csrf protection
    path: '/api/v1/auth/refresh-token',
  };

  public signup = asyncHandler(async (req: Request<IUser>, res: Response) => {
    let { user, accessToken, refreshToken } = await this.authService.signup(req.body);
    // TODO: make save the cookie name in a variable
    res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
    res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);

    res
      .status(201)
      .json(Object.assign(customResponse({ data: new UserDto(user), success: true, message: req.t('user_created') }), { accessToken }));
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    let { email, password } = req.body;
    let { user, accessToken, refreshToken } = await this.authService.login(email, password);

    res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
    res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);

    res
      .status(200)
      .json(Object.assign(customResponse({ data: new UserDto(user), success: true, message: req.t('user_logged_in') }), { accessToken }));
  });

  public logout = asyncHandler(async (req: Request, res: Response) => {
    if (!req.cookies.access_token) {
      res.status(401).json(customResponse({ data: null, success: false, message: req.t('unauthorized') }));
      return;
    }
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');

    res.status(200).json({ data: null, success: true, message: req.t('user_logged_out') });
  });

  public googleLogin = asyncHandler(async (req: Request, res: Response) => {
    let { credential } = req.body;
    if (!credential) {
      res.status(400).json(customResponse({ data: null, success: false, message: req.t('invalid_credentials') }));
      return;
    }
    let { user, accessToken, refreshToken } = await this.authService.googleLogin(credential);

    res.cookie('access_token', accessToken, this.accessTokenCookieOptions);
    res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);

    res
      .status(200)
      .json(Object.assign(customResponse({ data: new UserDto(user), success: true, message: req.t('user_logged_in') }), { accessToken }));
  });

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    if (!req.cookies.refresh_token || !req.cookies.access_token) {
      res.status(401).json(customResponse({ data: null, success: false, message: req.t('unauthorized') }));
      return;
    }
    let { accessToken } = await this.authService.refreshToken(req.cookies.refresh_token);

    res.cookie('access_token', accessToken, this.accessTokenCookieOptions);

    res.status(200).json(Object.assign(customResponse({ data: null, success: true, message: req.t('token_refreshed') }), { accessToken }));
  });

  public forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    let { email } = req.body;
    await this.authService.forgotPassword(email);
    res.status(200).json(customResponse({ data: null, success: true, message: req.t('reset_code_sent') }));
  });

  public verifyPassResetCode = asyncHandler(async (req: Request, res: Response) => {
    let { resetCode } = req.body;
    await this.authService.verifyPassResetCode(resetCode);
    res.status(200).json(customResponse({ data: null, success: true, message: req.t('reset_code_verified') }));
  });

  public resetPassword = asyncHandler(async (req: Request, res: Response) => {
    let { email, newPassword } = req.body;
    let results = await this.authService.resetPassword(email, newPassword);

    res.cookie('access_token', results.accessToken, this.accessTokenCookieOptions);
    res.cookie('refresh_token', results.refreshToken, this.refreshTokenCookieOptions);

    res
      .status(200)
      .json(
        customResponse(Object.assign({ data: null, success: true, message: req.t('password_reset') }, { accessToken: results.accessToken }))
      );
  });

  public changePassword = asyncHandler(async (req: Request, res: Response) => {
    let { token } = await this.authService.changePassword(req.body as { oldPassword: string; newPassword: string }, req.user!);
    res.cookie('access_token', token, this.accessTokenCookieOptions);

    res
      .status(200)
      .json(customResponse(Object.assign({ data: null, success: true, message: req.t('password_changed') }, { accessToken: token })));
  });
}
