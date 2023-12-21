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
    let { user, token } = await this.authService.signup(req.body);

    // Set access_token cookie
    res.cookie('access_token', token, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, // one month
      secure: process.env.NODE_ENV === 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
    });

    // Set refresh_token cookie
    res.cookie('refresh_token', token, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      secure: process.env.NODE_ENV === 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
      path: '/refresh_token',
    });

    res.status(201).json({ data: new UserDto(user), success: true, status: 201, message: 'User created', error: false });
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    let { email, password } = req.body;

    let { user, token } = await this.authService.login(email, password);

    // Set access_token cookie
    res.cookie('access_token', token, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, // one month
      secure: process.env.NODE_ENV === 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
    });

    // Set refresh_token cookie
    res.cookie('refresh_token', token, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      secure: process.env.NODE_ENV === 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
      path: '/refresh_token',
    });

    res.status(200).json({ data: new UserDto(user), success: true, status: 200, message: 'User logged in', error: false });
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
    // Set access_token cookie
    res.cookie('access_token', results.token, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, // one month
      secure: process.env.NODE_ENV === 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
    });

    // Set refresh_token cookie
    res.cookie('refresh_token', results.token, {
      httpOnly: true, // client side js cannot access the cookie
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      secure: process.env.NODE_ENV === 'development', // cookie only works in https
      sameSite: 'none', // cross-site access allowed,
      path: '/refresh_token',
    });

    res.status(200).json({ data: new UserDto(results.user), success: true, status: 200, message: 'Password reset done', error: false });
  });
}
