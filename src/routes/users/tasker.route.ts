import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { TaskerController } from '../../controllers/users/tasker.controller';
import { Routes } from '../../interfaces/routes.interface';
// import { UserType } from '../../interfaces/user.interface';
import { authenticateUser } from '../../middleware/auth.middleware';
import { isMongoId } from '../../middleware/validation/isMongoID.validator';
import { createTaskerValidator, updateTaskerValidator } from '../../middleware/validation/users/tasker.validator';

@autoInjectable()
class TaskerRoute implements Routes {
  public path = '/taskers';
  public router = Router();

  constructor(private readonly taskerController: TaskerController) {
    this.insitializeRoutes();
  }

  private insitializeRoutes() {
    //  Logged in user routes (authenticated)
    this.router.post(`${this.path}/become-tasker`, authenticateUser, createTaskerValidator, this.taskerController.becomeTasker);
    this.router.get(`${this.path}/me`, authenticateUser, this.taskerController.getTaskerProfile);
    this.router.patch(`${this.path}/me`, authenticateUser, updateTaskerValidator, this.taskerController.updateMyTaskerProfile);
    this.router.delete(`${this.path}/me`, authenticateUser, this.taskerController.deleteMyTaskerProfile);

    // Public routes
    this.router.get(`${this.path}/:id`, isMongoId, this.taskerController.getTaskerProfile);

    // Admin routes
    // this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
    // this.router.get(`${this.path}`, this.taskerController.getListOfTaskers);
  }
}

export { TaskerRoute };
