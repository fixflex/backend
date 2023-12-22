import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { AuthController } from '../controllers';
import { Routes } from '../interfaces/routes.interface';
import { loginValidator, signupValidator } from '../middleware/validation';

@autoInjectable()
export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();

  constructor(private readonly authController: AuthController) {
    this.initializerRoutes();
  }

  private initializerRoutes() {
    this.router.post(`${this.path}/signup`, signupValidator, this.authController.signup);
    this.router.post(`${this.path}/login`, loginValidator, this.authController.login);
    this.router.post(`${this.path}/logout`, this.authController.logout);
    // OAuth Routes - Google - Facebook
    this.router.post(`${this.path}/google`, this.authController.googleLogin);
    this.router.get(`${this.path}/refresh_token`, this.authController.refreshToken);
    // this.router.post(`${this.path}/activate`, this.authController.activateAccount);
    this.router.post(`${this.path}/forgotPassword`, this.authController.forgotPassword);
    this.router.post(`${this.path}/verifyResetCode`, this.authController.verifyPassResetCode);
    this.router.patch(`${this.path}/resetPassword`, this.authController.resetPassword);
  }
}
