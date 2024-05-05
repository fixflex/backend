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
// const categories = ['plumbing', 'electricity', 'painting', 'carpentry', 'cleaning', 'gardening', 'moving', 'other', 'handyman', 'assembly', 'delivery', 'personal assistant', 'shopping', 'cooking', 'laundry', 'other'];

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

// =====================================//
// =====================================//
// =====================================//
// =====================================//

/**
 *
 * 
 *  i want a better one ,
in this time i want to you start by Airtasker is a platform that connects people who need tasks done with individuals 
who are willing to complete those tasks for pay. It's like the Freelancing Platforms (Upwork , fiver, freelancer) , 
to the extent that user can post a task or job and the taskers make offers on this task then the user select the best suited for this task 
, but the there is a main difference between  Traditional Freelancing Platforms like Upwork and Airtasker that is the primary objective of Airtasker 
to connects people who need tasks like  ('plumbing', 'electricity', 'painting', 'carpentry', 'cleaning', 'gardening', 'moving', 'cooking' ) 
to be done with handyman how are willing to do those tasks for pay. 



// people who are willing to do those tasks 



 */
