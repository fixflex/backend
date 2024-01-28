import env from '../../config/validateEnv';
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

  toJSONLocalizedOnly(doc: ICategory | ICategory[], reqLanguage: string = env.defaultLocale): ICategory | ICategory[] {
    let localizedDoc = CategoryModel.schema.methods.toJSONLocalizedOnly(doc, reqLanguage);
    return localizedDoc;
  }
}

export { CategoryDao };
