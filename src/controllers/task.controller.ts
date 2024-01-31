import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import { Request } from '../helpers';
import customResponse from '../helpers/customResponse';
import { ITask, ITaskController } from '../interfaces';
import { uploadMixFiles } from '../middleware/uploadImages.middleware';
import { TaskService } from '../services/task.service';

@autoInjectable()
class TaskController implements ITaskController {
  constructor(private readonly taskService: TaskService) {}

  taskImages = uploadMixFiles([
    { name: 'imageCover', maxCount: 1 },
    { name: 'image', maxCount: 5 },
  ]);

  createTask = asyncHandler(async (req: Request<ITask>, res: Response, next: NextFunction) => {
    req.body.userId = req.user._id;
    const task = await this.taskService.createTask(req.body);
    if (!task) return next(new HttpException(400, 'something_went_wrong'));
    res.status(201).json(customResponse({ data: task, success: true, message: req.t('task_created') }));
  });

  getTasks = asyncHandler(async (req: Request, res: Response) => {
    const { tasks, pagination } = await this.taskService.getTasks(req.query);
    res.status(200).json(customResponse({ data: tasks, success: true, message: null, pagination, results: tasks.length }));
  });

  getTaskById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const task = await this.taskService.getTaskById(req.params.id);
    if (!task) return next(new HttpException(404, 'resource_not_found'));
    res.status(200).json(customResponse({ data: task, success: true, message: null }));
  });

  updateTask = asyncHandler(async (req: Request<ITask>, res: Response, next: NextFunction) => {
    const task = await this.taskService.updateTask(req.params.id, req.body, req.user._id);
    if (!task) return next(new HttpException(404, 'resource_not_found'));
    res.status(200).json(customResponse({ data: task, success: true, message: req.t('task_updated') }));
  });

  uploadTaskImages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) return next(new HttpException(400, 'Please upload files'));
    const task = await this.taskService.uploadTaskImages(
      req.params.id,
      req.files as { [fieldname: string]: Express.Multer.File[] },
      req.user._id
    ); // TODO: fix the type

    if (!task) return next(new HttpException(404, 'resource_not_found'));
    res.status(200).json(customResponse({ data: task, success: true, message: req.t('task_updated') }));
  });

  deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const task = await this.taskService.deleteTask(req.params.id, req.user._id);
    if (!task) return next(new HttpException(404, 'resource_not_found'));
    res.status(200).json(customResponse({ data: null, success: true, message: req.t('task_deleted') }));
  });

  // ==================== offer status ==================== //
  cancelTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const task = await this.taskService.cancelTask(req.params.id, req.user._id);
    if (!task) return next(new HttpException(404, 'resource_not_found'));
    res.status(200).json(customResponse({ data: task, success: true, message: req.t('task_canceled') }));
  });
}

export { TaskController };
