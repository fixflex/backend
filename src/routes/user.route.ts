import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { UserController } from '../controllers/users/user.controller';
import { Routes } from '../interfaces/routes.interface';
import { authenticateUser } from '../middleware/auth.middleware';
import { imageUpload } from '../middleware/uploadImages.middleware';
import { getUserValidator, updateLoggedUserValidator } from '../middleware/validation';

@autoInjectable()
class UserRoute implements Routes {
  public path = '/users';
  public router = Router();

  constructor(private readonly userController: UserController) {
    this.insitializeRoutes();
  }

  private insitializeRoutes() {
    //  Logged in user routes (authenticated)

    this.router
      .route(`${this.path}/me`)
      .get(authenticateUser, this.userController.getMe)
      .patch(authenticateUser, updateLoggedUserValidator, this.userController.updateMe)
      .delete(authenticateUser, this.userController.deleteMe);

    this.router.route(`${this.path}/profile-picture-upload`).patch(imageUpload.single('profilePicture'), this.userController.updateMyProfileImage);

    // Public routes
    this.router.get(`${this.path}/:id`, getUserValidator, this.userController.getUser);
  }
}

export { UserRoute };
