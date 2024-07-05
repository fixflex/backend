import { NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import HttpException from '../exceptions/HttpException';
import customResponse from '../helpers/customResponse';
import { Request, Response } from '../helpers/generic';
import { ICategory, ICategoryController } from '../interfaces/category.interface';
import { CategoryService } from '../services/category.service';

@autoInjectable()
class CategoryController implements ICategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // public Routes
  public getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    let service = await this.categoryService.getCategory(req.params.id, req.language);
    if (!service) throw new HttpException(404, 'No service found');
    res.status(200).json(customResponse<ICategory>({ data: service, success: true, message: 'Service found' }));
  });

  public getCategories = asyncHandler(async (req: Request, res: Response) => {
    let categories = await this.categoryService.getCategories(req.language);

    res.status(200).json(customResponse<ICategory[] | null>({ data: categories, success: true, message: req.t('services_found') }));
  });

  // authenticated routes
  public createCategory = asyncHandler(async (req: Request<ICategory>, res: Response, next: NextFunction) => {
    if (!req.body) return next(new HttpException(400, 'Please provide a service'));
    let service = await this.categoryService.createCategory(req.body);
    res.status(201).json({ data: service });
  });

  public updateCategory = asyncHandler(async (req: Request<ICategory>, res: Response, next: NextFunction) => {
    if (!req.body) return next(new HttpException(400, 'Please provide a service'));

    let service = await this.categoryService.updateCategory(req.params.id, req.body);
    if (!service) return next(new HttpException(404, 'No service found'));
    res.status(200).json({ data: service });
  });

  public uploadCategoryImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next(new HttpException(400, 'Please provide an image'));

    let service = await this.categoryService.uploadCategoryImage(req.params.id, req.file);
    if (!service) return next(new HttpException(404, 'No service found'));
    res.status(200).json({ data: service });
  });

  public deleteCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let service = await this.categoryService.deleteCategory(req.params.id);
    if (!service) return next(new HttpException(404, req.t('no_service_found')));
    res.sendStatus(204);
  });
}

export { CategoryController };
