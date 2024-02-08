import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { UserController } from '../controllers/user.controller';
import { Routes } from '../interfaces';
import { authenticateUser } from '../middleware/auth.middleware';
import { getUserValidator, updateLoggedUserValidator } from '../middleware/validation';

@autoInjectable()
class UserRoute implements Routes {
  public path = '/users';
  public router = Router();

  constructor(private readonly userController: UserController) {
    this.insitializeRoutes();
  }

  private insitializeRoutes() {
    // Logged in user routes (authenticated)
    this.router
      // TODO: change the route to /profile
      .route(`${this.path}/me`)
      .get(authenticateUser, this.userController.getMe)
      .patch(updateLoggedUserValidator, authenticateUser, this.userController.updateMe);
    // deactivate user
    // .delete(authenticateUser, this.userController.deleteMe);
    // TODO: enable user and disable user routes
    // user/enable
    // user/disable

    this.router
      .route(`${this.path}/me/profile-picture`)
      .patch(authenticateUser, this.userController.uploadProfileImage, authenticateUser, this.userController.updateMyProfileImage); // TODO: change the patch
    // Public routes
    this.router.get(`${this.path}/:id`, getUserValidator, this.userController.getUser);
  }
}

export { UserRoute };
