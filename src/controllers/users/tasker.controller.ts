import { NextFunction, Response } from 'express';
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
    let user = await this.taskerService.createTasker(userId!, req.body);
    if (!user) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(200).json({ data: user });
  });

  getTaskerProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId: string;
    if (req.params.id) userId = req.params.id;
    else userId = req.user?._id!;
    let user = await this.taskerService.getTaskerProfile(userId!);
    if (!user) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(200).json({ data: user });
  });

  getListOfTaskers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let taskers = await this.taskerService.getListOfTaskers(req.query);
    if (!taskers) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(200).json({ results: taskers.length, taskers });
  });

  updateMyTaskerProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let user = await this.taskerService.updateMyTaskerProfile(userId!, req.body);
    if (!user) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(200).json({ data: user });
  });

  deleteMyTaskerProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let user = await this.taskerService.deleteMyTaskerProfile(userId!);
    if (!user) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(200).json({ data: user });
  });
}

export { TaskerController };
