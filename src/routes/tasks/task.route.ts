import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { TaskController } from '../../controllers/tasks/task.controller';
import { Routes } from '../../interfaces';
import { authenticateUser } from '../../middleware/auth.middleware';
import { isMongoId } from '../../middleware/validation/isMongoID.validator';
import { createTaskValidator, updateTaskValidator } from '../../middleware/validation/tasks/tasks.validator';

@autoInjectable()
class TaskRoute implements Routes {
  public path = '/tasks';
  public router = Router();
  constructor(private readonly taskController: TaskController) {
    this.initializerRoutes();
  }
  private initializerRoutes() {
    //### tasks routes that don't require authentication
    this.router.get(`${this.path}`, this.taskController.getTasks);
    this.router.get(`${this.path}/:id`, isMongoId, this.taskController.getTaskById);
    // this.router.get(`${this.path}/:id/offers`, this.taskController.getTaskOffers);

    //### tasks routes that require authentication
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}`, createTaskValidator, this.taskController.createTask);
    // uplaodTaskImages,
    this.router.patch(`${this.path}/:id/images`, this.taskController.taskImages, this.taskController.uploadTaskImages);
    this.router.patch(`${this.path}/:id`, isMongoId, updateTaskValidator, this.taskController.updateTask);
    this.router.delete(`${this.path}/:id`, isMongoId, this.taskController.deleteTask);
  }
}

export { TaskRoute };

// this.router.get(`${this.path}/:id/images`, this.taskController.getTaskImages);
// this.router.get(`${this.path}/:id/owner`, this.taskController.getTaskOwner);
// this.router.get(`${this.path}/:id/tasker`, this.taskController.getTaskTasker);
// this.router.get(`${this.path}/:id/chat`, this.taskController.getTaskChat);
