import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { ServiceController } from '../controllers/service.controller';
import { Routes } from '../interfaces/routes.interface';
import { UserType } from '../interfaces/user.interface';
import { allowedTo, authenticateUser } from '../middleware/auth.middleware';

@autoInjectable()
export class ServiceRoute implements Routes {
  public path = '/users';
  public router = Router();
  constructor(private readonly serviceController: ServiceController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.get(`${this.path}/:id`, this.serviceController.getService);
    this.router.get(`${this.path}`, this.serviceController.getServices);

    // Admin routes
    this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
    this.router.post(`${this.path}`, this.serviceController.createService);
    this.router.put(`${this.path}/:id`, this.serviceController.updateService);
    this.router.delete(`${this.path}/:id`, this.serviceController.deleteService);
  }
}
