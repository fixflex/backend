import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { UserController } from '../../controllers/users/user.controller';
import { Routes } from '../../interfaces';
import { authenticateUser } from '../../middleware/auth.middleware';
import { changePasswordValidator, getUserValidator, updateLoggedUserValidator } from '../../middleware/validation';

@autoInjectable()
class UserRoute implements Routes {
  public path = '/users';
  public router = Router();

  constructor(private readonly userController: UserController) {
    this.insitializeRoutes();
  }

  private insitializeRoutes() {
    // Public routes
    this.router.get(`${this.path}/:id`, getUserValidator, this.userController.getUser);
    //  Logged in user routes (authenticated)
    this.router.use(`${this.path}`, authenticateUser);
    this.router.route(`${this.path}/me`).get(this.userController.getMe).patch(updateLoggedUserValidator, this.userController.updateMe).delete(this.userController.deleteMe);
    this.router.patch(`${this.path}/me/change-password`, changePasswordValidator, this.userController.changePassword);
    this.router.route(`${this.path}/me/profile-picture-upload`).patch(this.userController.uploadProfileImage, this.userController.updateMyProfileImage);
  }
}

export { UserRoute };
