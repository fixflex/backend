import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../../exceptions/HttpException';
import { AuthRequest } from '../../interfaces/auth.interface';
import { TaskService } from '../../services/tasks/task.service';
import customResponse from '../../utils/customResponse';

@autoInjectable()
class TaskController {
  constructor(private readonly taskService: TaskService) {}

  createTask = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    req.body.ownerId = req.user?._id;
    const task = await this.taskService.createTask(req.body);
    if (!task) return next(new HttpException(400, 'Something went wrong, please try again later'));
    res.status(201).json(customResponse({ data: task, success: true, status: 201, message: 'Task created', error: false }));
  });

  getTasks = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const tasks = await this.taskService.getTasks();
    res.status(200).json(customResponse({ data: tasks, success: true, status: 200, message: null, error: false }));
  });

  getTaskById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const task = await this.taskService.getTaskById(req.params.id);
    if (!task) return next(new HttpException(404, `Task with id ${req.params.id} not found`));
    res.status(200).json(customResponse({ data: task, success: true, status: 200, message: null, error: false }));
  });

  updateTask = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const task = await this.taskService.updateTask(req.params.id, req.body, req.user?._id);
    if (!task) return next(new HttpException(404, `Task with id ${req.params.id} not found`));
    res.status(200).json(customResponse({ data: task, success: true, status: 200, message: 'Task updated', error: false }));
  });

  deleteTask = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const task = await this.taskService.deleteTask(req.params.id, req.user?._id);
    if (!task) return next(new HttpException(404, `Task with id ${req.params.id} not found`));
    res.status(200).json(customResponse({ data: null, success: true, status: 204, message: 'Task deleted', error: false }));
  });
}

export { TaskController };
