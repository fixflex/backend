import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../../exceptions/HttpException';
import { AuthRequest } from '../../interfaces/auth.interface';
import { IUser } from '../../interfaces/user.interface';
import { UserService } from '../../services/users/user.service';
import customResponse from '../../utils/customResponse';

@autoInjectable()
class UserController {
  constructor(private readonly userService: UserService) {}

  // public Routes
  public getUser = asyncHandler(async (req: Request, res: Response) => {
    let user = await this.userService.getUser(req.params.id);
    if (!user) throw new HttpException(404, 'No user found');
    res.status(200).json(customResponse<IUser>({ data: user, success: true, status: 200, message: 'User found', error: false }));
  });

  // user profile routes (authenticated)
  public getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    let userData = {
      _id: req.user?._id,
      fullName: req.user?.firstName + ' ' + req.user?.lastName,
      email: req.user?.email,
      profilePicture: req.user?.profilePicture,
    };

    res.status(200).json(customResponse({ data: userData, success: true, status: 200, message: 'User found', error: false }));
  });

  public updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    let user = await this.userService.updateUser(req.user?._id!, req.body);
    if (!user) throw new HttpException(404, 'No user found');
    res.status(200).json(customResponse<IUser>({ data: user, success: true, status: 200, message: 'User updated', error: false }));
  });

  public deleteMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.userService.deleteUser(req.user?._id!);
    res.sendStatus(204).json(customResponse({ data: null, success: true, status: 204, message: 'User deleted', error: false }));
  });

  public updateMyProfileImage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    if (!req.file) return next(new HttpException(400, 'Please upload a file'));

    let user = this.userService.updateProfileImage(userId!, req.file);
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json(customResponse({ data: user, success: true, status: 200, message: 'User updated', error: false }));
  });
}

export { UserController };
