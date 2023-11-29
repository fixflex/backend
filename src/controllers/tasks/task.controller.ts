import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import { TaskService } from '../../services/tasks/task.service';
import customResponse from '../../utils/customResponse';

@autoInjectable()
class TaskController {
  constructor(private readonly taskService: TaskService) {}

  createTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await this.taskService.createTask(req.body);
    res.status(201).json(customResponse({ data: task, success: true, status: 201, message: 'Task created', error: false }));
  });

  getTasks = asyncHandler(async (_req: Request, res: Response) => {
    const tasks = await this.taskService.getTasks();
    res.status(200).json(customResponse({ data: tasks, success: true, status: 200, message: null, error: false }));
  });

  getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const task = await this.taskService.getTaskById(req.params.id);
    res.status(200).json(customResponse({ data: task, success: true, status: 200, message: null, error: false }));
  });

  updateTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await this.taskService.updateTask(req.params.id, req.body);
    res.status(200).json(customResponse({ data: task, success: true, status: 200, message: 'Task updated', error: false }));
  });

  deleteTask = asyncHandler(async (req: Request, res: Response) => {
    await this.taskService.deleteTask(req.params.id);
    res.status(200).json(customResponse({ data: null, success: true, status: 204, message: 'Task deleted', error: false }));
  });
}

export { TaskController };
