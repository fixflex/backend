import { Router } from 'express';
import { container } from 'tsyringe';

import { AuthController } from '../controllers';
import { Routes } from '../interfaces/routes.interface';
import { loginValidator, signupValidator } from '../middleware/validation';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = container.resolve(AuthController);

  constructor() {
    this.initializerRoutes();
  }

  private initializerRoutes() {
    this.router.post(`${this.path}/signup`, signupValidator, this.authController.signup);
    this.router.post(`${this.path}/login`, loginValidator, this.authController.login);
  }
}
