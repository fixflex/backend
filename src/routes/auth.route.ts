import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { AuthController } from '../controllers';
import { Routes } from '../interfaces';
import { authenticateUser } from '../middleware/auth.middleware';
import { changePasswordValidator, loginValidator, signupValidator } from '../middleware/validation';

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

    this.router.get(`${this.path}/refresh-token`, this.authController.refreshToken);

    // OAuth Routes - Google - Facebook
    this.router.post(`${this.path}/google`, this.authController.googleLogin);

    // this.router.post(`${this.path}/activate`, this.authController.activateAccount);
    this.router.post(`${this.path}/forgot-password`, this.authController.forgotPassword);

    this.router.post(`${this.path}/verify-reset-code`, this.authController.verifyPassResetCode);

    this.router.patch(`${this.path}/reset-password`, this.authController.resetPassword);

    this.router.patch(`${this.path}/change-password`, authenticateUser, changePasswordValidator, this.authController.changePassword);
  }
}
