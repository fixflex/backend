import { NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import customResponse from '../helpers/customResponse';
import { Request, Response } from '../helpers/generic';
import { ITasker, ITaskerController } from '../interfaces/tasker.interface';
import { TaskerService } from '../services/tasker.service';

@autoInjectable()
class TaskerController implements ITaskerController {
  constructor(private readonly taskerService: TaskerService) {}
  createTasker = asyncHandler(async (req: Request<ITasker>, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let user = await this.taskerService.createTasker(userId!, req.body);
    if (!user) return next(new HttpException(400, 'something_went_wrong')); //
    res.status(201).json(customResponse<ITasker>({ data: user, success: true, status: 200, message: req.t('tasker_created'), error: false }));
  });

  getTaskerPublicProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let taskerId: string;
    taskerId = req.params.id;
    let tasker = await this.taskerService.getTasker(taskerId!);
    if (!tasker) return next(new HttpException(404, 'tasker_not_found'));
    res.status(200).json(customResponse<ITasker>({ data: tasker, success: true, status: 200, message: req.t('tasker_found'), error: false }));
  });

  // get tasker profile by user id
  getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let tasker = await this.taskerService.getMyProfile(userId!);
    if (!tasker) return next(new HttpException(404, 'tasker_not_found'));
    res.status(200).json(customResponse<ITasker>({ data: tasker, success: true, status: 200, message: req.t('tasker_found'), error: false }));
  });
  getTaskers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let taskers = await this.taskerService.getTaskers(req.query);
    if (!taskers) return next(new HttpException(400, 'something_went_wrong'));
    res.status(200).json(Object.assign({ results: taskers.length }, customResponse<ITasker[]>({ data: taskers, success: true, status: 200, message: null, error: false })));
  });

  updateMe = asyncHandler(async (req: Request<ITasker>, res: Response, next: NextFunction) => {
    let userId = req.user?._id;
    let updatedTasker = await this.taskerService.updateTasker(userId!, req.body);
    console.log(updatedTasker);
    if (updatedTasker.modifiedCount == 0) return next(new HttpException(404, 'tasker_not_found'));
    res.status(200).json(customResponse({ data: null, success: true, error: false, message: req.t('tasker_updated'), status: 200 }));
  });

  deleteTasker = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.user?._id; //
    let user = await this.taskerService.deleteTasker(userId!);
    if (user.deletedCount == 0) return next(new HttpException(404, 'tasker_not_found'));
    res.status(204).json(customResponse({ data: null, success: true, error: false, message: req.t('tasker_deleted'), status: 204 }));
  });
}

export { TaskerController };
