import { Query } from 'express-serve-static-core';

import env from '../../config/validateEnv';
import { QueryBuilder } from '../../helpers';
import { IPagination } from '../../interfaces';
import { ICategory } from '../../interfaces/category.interface';
import CategoryModel from '../models/category.model';
import CommonDAO from './baseDao';

class CategoryDao extends CommonDAO<ICategory> {
  // private readonly categoryModel = CategoryModel;
  // inject the reqLanguage to the constructor to be used in the toJSONLocalizedOnly method
  constructor() {
    super(CategoryModel);
  }
  async getCategoryByName(name: string): Promise<ICategory | null> {
    return await CategoryModel.findOne({ name });
  }

  async getCategories(query: Query) {
    const countDocments = await CategoryModel.countDocuments();

    let apiFeatures = new QueryBuilder<ICategory>(CategoryModel.find(), query)
      .filter()
      .search(['name', 'description'])
      .sort()
      .limitFields()
      .paginate(countDocments);

    const pagination: IPagination | undefined = apiFeatures.pagination;
    const categories = await apiFeatures.mongooseQuery.select('-__v');

    return { categories, pagination };
  }

  toJSONLocalizedOnly(doc: ICategory | ICategory[], reqLanguage: string = env.defaultLocale): ICategory | ICategory[] {
    let localizedDoc = CategoryModel.schema.methods.toJSONLocalizedOnly(doc, reqLanguage);
    return localizedDoc;
  }
}

export { CategoryDao };
