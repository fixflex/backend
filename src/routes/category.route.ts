import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { CategoryController } from '../controllers';
import { UserType } from '../interfaces';
import { Routes } from '../interfaces/routes.interface';
import { allowedTo, authenticateUser } from '../middleware/auth.middleware';
import { createCategoryValidator } from '../middleware/validation';
import { isMongoId } from '../middleware/validation/isMongoID.validator';
import { uploadServiceImage } from '../services';

@autoInjectable()
export class CategoryRoute implements Routes {
  public path = '/categories';
  public router = Router();
  constructor(private readonly categoryController: CategoryController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.get(`${this.path}`, this.categoryController.getCategories);
    this.router.get(`${this.path}/:id`, isMongoId, this.categoryController.getCategoryById);

    // Admin routes
    this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
    this.router.post(`${this.path}`, createCategoryValidator, this.categoryController.createCategory);

    this.router.route(`${this.path}/upload-service-image/:id`).patch(isMongoId, uploadServiceImage, this.categoryController.uploadCategoryImage);
    this.router.patch(`${this.path}/:id`, isMongoId, this.categoryController.updateCategory);
    this.router.delete(`${this.path}/:id`, isMongoId, this.categoryController.deleteCategory);
  }
}
