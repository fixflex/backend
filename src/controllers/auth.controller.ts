import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import { UserDto } from '../dtos/dto.user';
// import { IUser } from '../interfaces/user.interface';
import { AuthServie } from '../services/auth.service';
import customResponse from '../utils/customResponse';

// TODO: use passport.js for authentication
// TODO: refresh token and logout routes
@autoInjectable()
export class AuthController {
  constructor(private readonly authService: AuthServie) {}

  public signup = asyncHandler(async (req: Request, res: Response) => {
    let { user, accessToken, refreshToken } = await this.authService.signup(req.body);

    // Set accesstoken cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, // one month
      secure: process.env.NODE_ENV !== 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
    });

    // Set refresh_token cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      secure: process.env.NODE_ENV !== 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
      path: '/api/v1/auth/refresh-token',
    });

    res.status(201).json({ data: new UserDto(user), success: true, status: 201, message: 'User created', error: false });
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    let { email, password } = req.body;

    let { user, accessToken, refreshToken } = await this.authService.login(email, password);

    // Set accesstoken cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, // one month
      secure: process.env.NODE_ENV !== 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
    });

    // Set refresh_token cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      secure: process.env.NODE_ENV !== 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
      path: '/api/v1/auth/refresh-token',
    });

    res.status(200).json({ data: new UserDto(user), success: true, status: 200, message: 'User logged in', error: false });
  });

  public logout = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie('refresh_token');
    res.clearCookie('accesstoken');
    res.status(200).json({ data: null, success: true, status: 200, message: 'User logged out', error: false });
  });

  public googleLogin = asyncHandler(async (req: Request, res: Response) => {
    let { credential } = req.body;

    let { user, accessToken, refreshToken } = await this.authService.googleLogin(credential);

    // Set accesstoken cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, // one month
      secure: process.env.NODE_ENV !== 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
    });

    // Set refresh_token cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      secure: process.env.NODE_ENV !== 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
      path: '/api/v1/auth/refresh-token',
    });

    res.status(200).json({ data: new UserDto(user), success: true, status: 200, message: 'User logged in', error: false });
  });

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    // get refresh_token from cookies
    let refreshToken = req.cookies.refresh_token;
    // let accessToken_ = req.cookies.access_token;

    if (!refreshToken) {
      res.status(401).json(customResponse({ data: null, success: false, status: 401, message: 'You are not authorized, you must login to get access this route', error: true }));
      return;
    }
    let { accessToken } = await this.authService.refreshToken(refreshToken);

    // Set accesstoken cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, // one month
      secure: process.env.NODE_ENV !== 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
    });

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

    // Set cookies
    // Set accesstoken cookie
    res.cookie('access_token', results.accessToken, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, // one month
      secure: process.env.NODE_ENV !== 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
    });

    // Set refresh_token cookie
    res.cookie('refresh_token', results.refreshToken, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      secure: process.env.NODE_ENV !== 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
      path: '/api/v1/auth/refresh-token',
    });

    res.status(200).json({ data: new UserDto(results.user), success: true, status: 200, message: 'Password reset done', error: false });
  });
}
