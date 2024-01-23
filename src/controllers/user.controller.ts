import { NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { Request, Response } from '../helpers';
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
    if (!user) throw new HttpException(404, 'user_not_found');
    // TODO: remove status from customResponse
    res.status(200).json(customResponse<IUser>({ data: user, success: true, status: 200, message: req.t('user_found'), error: false }));
  });

  // user profile routes (authenticated)
  public getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    // console.log(req.headers);
    res.status(200).json(customResponse({ data: req.user, success: true, status: 200, message: req.t('user_found'), error: false }));
  });

  public updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    let user = await this.userService.updateUser(req.user?._id!, req.body);
    if (!user) throw new HttpException(404, 'user_not_found');
    res.status(200).json(customResponse<IUser>({ data: user, success: true, status: 200, message: req.t('user_updated'), error: false }));
  });

  public deleteMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.userService.updateUser(req.user?._id!, { active: false });
    res.status(204).json(customResponse({ data: null, success: true, status: 204, message: req.t('user_deleted'), error: false }));
  });

  public updateMyProfileImage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    if (!req.file) return next(new HttpException(400, 'image_required'));
    // console.log(req.file);
    let user = await this.userService.updateProfileImage(userId!, req.file);
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json(customResponse({ data: user, success: true, status: 200, message: req.t('user_updated'), error: false }));
  });
}

export { UserController };
