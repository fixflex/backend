import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import customResponse from '../helpers/customResponse';
import { AuthRequest } from '../interfaces/auth.interface';
import { IUser, IUserController } from '../interfaces/user.interface';
import { uploadSingleFile } from '../middleware/uploadImages.middleware';
import { UserService } from '../services/user.service';

@autoInjectable()
class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  // public Routes

  uploadProfileImage = uploadSingleFile('image');

  public getUser = asyncHandler(async (req: Request, res: Response) => {
    let user = await this.userService.getUser(req.params.id);
    if (!user) throw new HttpException(404, 'No user found');
    // TODO: remove status from customResponse
    res.status(200).json(customResponse<IUser>({ data: user, success: true, status: 200, message: 'User found', error: false }));
  });

  // user profile routes (authenticated)
  public getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    // console.log(req.headers);
    res.status(200).json(customResponse({ data: req.user, success: true, status: 200, message: 'User found', error: false }));
  });

  public updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    let user = await this.userService.updateUser(req.user?._id!, req.body);
    if (!user) throw new HttpException(404, 'No user found');
    res.status(200).json(customResponse<IUser>({ data: user, success: true, status: 200, message: 'User updated', error: false }));
  });

  public deleteMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.userService.updateUser(req.user?._id!, { active: false });
    res.status(204).json(customResponse({ data: null, success: true, status: 204, message: 'User deleted', error: false }));
  });

  public updateMyProfileImage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    if (!req.file) return next(new HttpException(400, 'Please upload a file'));
    // console.log(req.file);
    let user = await this.userService.updateProfileImage(userId!, req.file);
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json(customResponse({ data: user, success: true, status: 200, message: 'User updated', error: false }));
  });
}

export { UserController };
