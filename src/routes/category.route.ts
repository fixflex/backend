import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { CategoryController } from '../controllers';
import { UserType } from '../interfaces';
import { Routes } from '../interfaces/routes.interface';
import { allowedTo, authenticateUser } from '../middleware/auth.middleware';
import { createCategoryValidator } from '../middleware/validation';
import { isMongoId } from '../middleware/validation/isMongoID.validator';
import { uploadServiceImage } from '../services/category.service';

@autoInjectable()
export class CategoryRoute implements Routes {
  public path = '/services';
  public router = Router();
  constructor(private readonly categoryController: CategoryController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.get(`${this.path}`, this.categoryController.getServices);
    this.router.get(`${this.path}/:id`, isMongoId, this.categoryController.getServiceById);

    // Admin routes
    this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
    this.router.post(`${this.path}`, createCategoryValidator, this.categoryController.createService);

    this.router.route(`${this.path}/upload-service-image/:id`).patch(isMongoId, uploadServiceImage, this.categoryController.uploadServiceImage);
    this.router.patch(`${this.path}/:id`, isMongoId, this.categoryController.updateService);
    this.router.delete(`${this.path}/:id`, isMongoId, this.categoryController.deleteService);
  }
}
