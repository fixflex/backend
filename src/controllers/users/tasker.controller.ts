import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../../exceptions/HttpException';
import { AuthRequest } from '../../interfaces/auth.interface';
import { TaskerService } from '../../services/users/tasker.service';

@autoInjectable()
class TaskerController {
  constructor(private readonly taskerService: TaskerService) {}
  becomeTasker = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let user = await this.taskerService.registerAsTasker(userId!, req.body);
    if (!user) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(200).json({ data: user });
  });
}

export { TaskerController };
