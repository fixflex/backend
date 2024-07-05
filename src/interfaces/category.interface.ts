import { NextFunction } from 'express';
import { Document } from 'mongoose';

import { Request, Response } from '../helpers';

export interface ICategory extends Document {
  _id?: string;
  name: string;
  description: string;
  image: {
    url: string;
    publicId: string | null;
  };
}

export interface ICategoryController {
  getCategories(req: Request, res: Response, next: NextFunction): void;
  getCategoryById(req: Request, res: Response, next: NextFunction): void;
  createCategory(req: Request, res: Response, next: NextFunction): void;
  updateCategory(req: Request, res: Response, next: NextFunction): void;
  deleteCategory(req: Request, res: Response, next: NextFunction): void;
  uploadCategoryImage(req: Request, res: Response, next: NextFunction): void;
}

export interface ICategoryService {
  getCategories(reqQuery: any, reqLanguage: string): Promise<ICategory[] | null>;
  getCategory(categoryId: string, reqLanguage: string): Promise<ICategory>;
  createCategory(category: ICategory): Promise<ICategory>;
  updateCategory(categoryId: string, category: ICategory): Promise<ICategory | null>;
  deleteCategory(categoryId: string): Promise<ICategory | null>;
  uploadCategoryImage(categoryId: string, file: Express.Multer.File): Promise<ICategory | null>;
}
