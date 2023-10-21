import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { TaskerController } from '../controllers/users/tasker.controller';
import { Routes } from '../interfaces/routes.interface';
import { authenticateUser } from '../middleware/auth.middleware';
import { createTaskerValidator } from '../middleware/validation/users/tasker.validator';

@autoInjectable()
class TaskerRoute implements Routes {
  public path = '/taskers';
  public router = Router();

  constructor(private readonly taskerController: TaskerController) {
    this.insitializeRoutes();
  }

  private insitializeRoutes() {
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}/become-tasker`, createTaskerValidator, this.taskerController.becomeTasker);
  }
}

export { TaskerRoute };
