import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../../exceptions/HttpException';
import { AuthRequest } from '../../interfaces/auth.interface';
import { UserService } from '../../services/users/user.service';

@autoInjectable()
class UserController {
  constructor(private readonly userService: UserService) {}

  // public Routes
  public getUser = asyncHandler(async (req: Request, res: Response) => {
    let user = await this.userService.getUser(req.params.id);
    res.status(200).json({ data: user });
  });

  // user profile routes (authenticated)
  public getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    res.status(200).json({ data: req.user });
  });

  public updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    let user = await this.userService.updateUser(req.user?._id!, req.body);
    res.status(200).json({ data: user });
  });

  public deleteMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.userService.deleteUser(req.user?._id!);
    res.sendStatus(204);
  });

  public updateMyProfileImage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    if (!req.file) return next(new HttpException(400, 'Please upload a file'));

    let user = this.userService.updateProfileImage(userId!, req.file);
    if (!user) return next(new HttpException(404, 'No user found'));
    res.status(200).json({ data: user });
  });
}

export { UserController };
