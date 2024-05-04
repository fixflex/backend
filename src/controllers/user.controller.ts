import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import { UserDto } from '../dtos';
import HttpException from '../exceptions/HttpException';
import { NextFunction, Request, Response } from '../helpers';
import customResponse from '../helpers/customResponse';
import { IUser, IUserController } from '../interfaces';
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
    res.status(200).json(customResponse<Partial<IUser>>({ data: new UserDto(user), success: true, message: req.t('user_found') }));
  });

  /**
   *  @desc    Get logged in user
   *  @route   GET /api/v1/auth/me
   *  @access  Private
   */
  public getMe = asyncHandler(async (req: Request, res: Response) => {
    // console.log(req.headers);
    res.status(200).json(customResponse({ data: req.user, success: true, message: req.t('user_found') }));
  });

  public updateMe = asyncHandler(async (req: Request, res: Response) => {
    let user = await this.userService.updateUser(req.user._id, req.body);
    if (!user) throw new HttpException(404, 'user_not_found');
    res.status(200).json(customResponse<IUser>({ data: user, success: true, message: req.t('user_updated') }));
  });

  public deleteMe = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.updateUser(req.user._id, { active: false });
    res.status(204).json(customResponse({ data: null, success: true, message: req.t('user_deleted') }));
  });

  public updateMyProfileImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.user._id;
    if (!req.file) return next(new HttpException(400, 'image_required'));
    // console.log(req.file);
    let user = await this.userService.updateProfileImage(userId, req.file);
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json(customResponse({ data: user, success: true, message: req.t('user_updated') }));
  });

  public sendVerificationCode = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let isSend = await this.userService.sendVerificationCode(req.user);
    if (!isSend) return next(new HttpException(500, 'something_went_wrong'));
    res.status(200).json(customResponse({ data: null, success: true, message: req.t('verification_code_sent') }));
  });

  public verifyCode = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let isVerified = await this.userService.verifyCode(req.user, req.body.verificationCode);
    if (!isVerified) return next(new HttpException(400, 'invalid_code'));
    res.status(200).json(customResponse({ data: null, success: true, message: req.t('phone_verified') }));
  });
}

export { UserController };
