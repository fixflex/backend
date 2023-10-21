import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { ServiceController } from '../controllers/service.controller';
import { Routes } from '../interfaces/routes.interface';
import { UserType } from '../interfaces/user.interface';
import { allowedTo, authenticateUser } from '../middleware/auth.middleware';
import { isMongoId } from '../middleware/validation/isMongoID.validator';
import { createServiceValidator } from '../middleware/validation/serviceValidator';

@autoInjectable()
export class ServiceRoute implements Routes {
  public path = '/services';
  public router = Router();
  constructor(private readonly serviceController: ServiceController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.get(`${this.path}`, this.serviceController.getServices);
    this.router.get(`${this.path}/:id`, isMongoId, this.serviceController.getService);

    // Admin routes
    this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
    this.router.post(`${this.path}`, createServiceValidator, this.serviceController.createService);
    this.router.patch(`${this.path}/:id`, isMongoId, this.serviceController.updateService);
    this.router.delete(`${this.path}/:id`, isMongoId, this.serviceController.deleteService);
  }
}
