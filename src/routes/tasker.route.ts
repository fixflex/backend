import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { TaskerController } from '../controllers/tasker.controller';
import { Routes } from '../interfaces/routes.interface';
// import { UserType } from '../../interfaces/user.interface';
import { authenticateUser } from '../middleware/auth.middleware';
import { isMongoId } from '../middleware/validation/isMongoID.validator';
import { createTaskerValidator, updateTaskerValidator } from '../middleware/validation/tasker.validator';

@autoInjectable()
class TaskerRoute implements Routes {
  public path = '/taskers';
  public router = Router();

  constructor(private readonly taskerController: TaskerController) {
    this.insitializeRoutes();
  }

  private insitializeRoutes() {
    //  Logged in user routes (authenticated)
    this.router.post(`${this.path}/become-tasker`, authenticateUser, createTaskerValidator, this.taskerController.createTasker);
    this.router.get(`${this.path}/me`, authenticateUser, this.taskerController.getMe);
    this.router.patch(`${this.path}/me`, authenticateUser, updateTaskerValidator, this.taskerController.updateMe);
    // this.router.delete(`${this.path}/me`, authenticateUser, this.taskerController.deleteTasker);

    this.router.post(`${this.path}/commission-pay`, authenticateUser, this.taskerController.checkout);
    // this.router.post(`${this.path}/checkout`, authenticateUser, this.taskerController.checkout);
    // this.router.post(`${this.path}/withdraw-earnings`, authenticateUser, this.taskerController.withdrawEarnings)

    // apply coupon
    this.router.post(`${this.path}/apply-coupon`, authenticateUser, this.taskerController.applyCoupon);

    // Public routes
    this.router.get(`${this.path}/:id`, isMongoId, this.taskerController.getTaskerPublicProfile);
    // get list of taskers by location and service (optional)
    this.router.get(`${this.path}`, this.taskerController.getTaskers);

    // Admin routes
    // this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
    // this.router.get(`${this.path}`, this.taskerController.getListOfTaskers);
  }
}

export { TaskerRoute };
