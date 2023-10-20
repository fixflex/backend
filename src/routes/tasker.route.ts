import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { TaskerController } from '../controllers/users/tasker.controller';
import { Routes } from '../interfaces/routes.interface';
import { authenticateUser } from '../middleware/auth.middleware';

@autoInjectable()
class UserRoute implements Routes {
  public path = '/tasker';
  public router = Router();

  constructor(private readonly taskerController: TaskerController) {
    this.insitializeRoutes();
  }

  private insitializeRoutes() {
    this.router.post(`${this.path}/become-tasker`, createTaskerValidator, authenticateUser, this.taskerController.becomeTasker);
  }
}

export { UserRoute };
