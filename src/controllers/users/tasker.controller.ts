import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../../exceptions/HttpException';
import { AuthRequest } from '../../interfaces/auth.interface';
import { ITasker } from '../../interfaces/user.interface';
import { TaskerService } from '../../services/users/tasker.service';
import customResponse from '../../utils/customResponse';

@autoInjectable()
class TaskerController {
  constructor(private readonly taskerService: TaskerService) {}
  becomeTasker = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let user = await this.taskerService.createTasker(userId!, req.body);
    if (!user) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(201).json(customResponse<ITasker>({ data: user, success: true, status: 200, message: 'User updated', error: false }));
  });

  getTaskerProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let taskerId: string;
    if (req.params.id) taskerId = req.params.id;
    let tasker = await this.taskerService.getTaskerProfile(taskerId!);
    if (!tasker) return next(new HttpException(404, `The tasker with id ${taskerId!} ddoesn't exist`));
    res.status(200).json(customResponse<ITasker>({ data: tasker, success: true, status: 200, message: 'User updated', error: false }));
  });

  getListOfTaskers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let taskers = await this.taskerService.getListOfTaskers(req.query);
    if (!taskers) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res
      .status(200)
      .json(Object.assign({ results: taskers.length }, customResponse<ITasker[]>({ data: taskers, success: true, status: 200, message: 'User updated', error: false })));
  });

  updateMyTaskerProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let user = await this.taskerService.updateMyTaskerProfile(userId!, req.body);
    if (!user) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(200).json(customResponse<ITasker>({ data: user, success: true, error: false, message: 'User updated', status: 200 }));
  });

  deleteMyTaskerProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let userId = req.user?._id; // fix this later , you should  pass taskerId
    let user = await this.taskerService.deleteMyTaskerProfile(userId!);
    if (!user) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(204).json(customResponse({ data: null, success: true, error: false, message: 'User deleted', status: 204 }));
  });
}

export { TaskerController };
