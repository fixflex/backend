import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import { whatsappclient } from '..';
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

    // phone number verification
    this.router.post(
      `${this.path}/verify-phone`,
      asyncHandler(async (req: any, res: any, _next: any) => {
        console.log('phone verification route');
        let verificationCode: any = Math.floor(100000 + Math.random() * 900000); // 6 digits random code
        whatsappclient.sendMessage(req.body.phoneNumber, `Your verification code is: ${verificationCode}`);
        res.status(200).json({ message: 'Verification code sent' });
      })
    );
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
