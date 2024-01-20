import { ICategory } from '../../interfaces/category.interface';
import CategoryModel from '../models/category.model';
import CommonDAO from './commonDAO';

class CategoryDao extends CommonDAO<ICategory> {
  constructor() {
    super(CategoryModel);
  }
  async getServiceByName(name: string): Promise<ICategory | null> {
    return await CategoryModel.findOne({ name }).lean();
  }

  async listServices(query: any = {}, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<ICategory[]> {
    // build the query
    let categories = CategoryModel.find(query);
    if (paginate.skip) categories = categories.skip(paginate.skip);
    if (paginate.limit) categories = categories.limit(paginate.limit);
    categories = categories.sort(sort).select(select);
    // execute the query
    return await categories.lean();
  }
}

export { CategoryDao };
