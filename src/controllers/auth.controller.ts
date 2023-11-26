import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

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
    const userData = { _id: user._id, email: user.email, fullName: user.firstName + ' ' + user.lastName };
    res.status(201).json(Object.assign(customResponse({ data: userData, success: true, status: 201, message: 'User created', error: false }), { token }));
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    let { email, password } = req.body;

    let { user, token } = await this.authService.login(email, password);
    const userData = { _id: user._id, email: user.email, fullName: user.firstName + ' ' + user.lastName, profilePicture: user.profilePicture };

    res.status(200).json(Object.assign(customResponse({ data: userData, success: true, status: 200, message: 'User logged in', error: false }), { token }));
  });
}
