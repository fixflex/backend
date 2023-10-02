import { Router } from 'express';

import UserController from '../controllers/user.controller';
import { Routes } from '../interfaces/routes.interface';
import { allowedTo, authenticateUser } from '../middleware/auth.middleware';
import { imageUpload } from '../middleware/uploadImages.middleware';
import {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
} from '../middleware/validation';

class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.insitializeRoutes();
  }

  private insitializeRoutes() {
    this.router.use(`${this.path}`, authenticateUser, allowedTo('admin'));
    this.router
      .route(`${this.path}/profile-picture-upload/:id`)
      .put(imageUpload.single('profilePicture'), this.userController.updateProfileImage);
    this.router
      .route(`${this.path}`)
      .get(this.userController.getUsers)
      .post(createUserValidator, this.userController.createUser);

    this.router
      .route(`${this.path}/:id`)
      .get(getUserValidator, this.userController.getUser)
      .put(updateUserValidator, this.userController.updateUser)
      .delete(deleteUserValidator, this.userController.deleteUser);
  }
}

export { UserRoute };
