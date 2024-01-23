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

  async getCategories(query: any = {}, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<ICategory[] | null> {
    // build the query
    let categories = CategoryModel.find(query);
    if (paginate.skip) categories = categories.skip(paginate.skip);
    if (paginate.limit) categories = categories.limit(paginate.limit);
    categories = categories.sort(sort).select(select);
    // execute the query
    let categoriesList = await categories;

    return categoriesList;
  }

  toJSONLocalizedOnly(doc: ICategory | ICategory[], reqLanguage: string = env.defaultLocale): ICategory | ICategory[] {
    let localizedDoc = CategoryModel.schema.methods.toJSONLocalizedOnly(doc, reqLanguage);
    return localizedDoc;
  }
}

export { CategoryDao };
