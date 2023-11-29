import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { TaskController } from '../../controllers/tasks/task.controller';
import { Routes } from '../../interfaces';
import { authenticateUser } from '../../middleware/auth.middleware';

@autoInjectable()
class TaskRoute implements Routes {
  public path = '/task';
  public router = Router();

  constructor(private readonly taskController: TaskController) {
    this.initializerRoutes();
  }
  private initializerRoutes() {
    //### tasks routes that don't require authentication
    this.router.get(`${this.path}`, this.taskController.getTasks);
    this.router.get(`${this.path}/:id`, this.taskController.getTaskById);
    // this.router.get(`${this.path}/:id/offers`, this.taskController.getTaskOffers);

    //### tasks routes that require authentication
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}`, this.taskController.createTask);
    this.router.put(`${this.path}/:id`, this.taskController.updateTask);
    this.router.delete(`${this.path}/:id`, this.taskController.deleteTask);
  }
}

export default TaskRoute;

// this.router.get(`${this.path}/:id/images`, this.taskController.getTaskImages);
// this.router.get(`${this.path}/:id/owner`, this.taskController.getTaskOwner);
// this.router.get(`${this.path}/:id/tasker`, this.taskController.getTaskTasker);
// this.router.get(`${this.path}/:id/chat`, this.taskController.getTaskChat);
