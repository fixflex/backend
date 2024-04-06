import { autoInjectable } from 'tsyringe';

import { CategoryDao } from '../DB/dao/category.dao';
import HttpException from '../exceptions/HttpException';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../helpers/cloudinary';
import { ICategory, ICategoryService } from '../interfaces/category.interface';
import { uploadSingleFile } from '../middleware/uploadImages.middleware';

export const uploadServiceImage = uploadSingleFile('image');
@autoInjectable()
class CategoryService implements ICategoryService {
  constructor(private readonly categoryDao: CategoryDao) { }

  async createCategory(category: ICategory) {
    let isCategoryExists = await this.categoryDao.getCategoryByName(category.name);
    if (isCategoryExists) {
      throw new HttpException(409, `Service ${category.name} is already exists, please pick a different one.`);
    }
    let newCategory = await this.categoryDao.create(category);
    // oneSignal create tag for the new category to add tasker who are interested in this category to the tag list to send them notifications
    return newCategory;
  }

  async getCategories(reqLanguage: string): Promise<ICategory[] | null> {
    const categories = await this.categoryDao.getMany({}, '', false);

    let localizedDocs: ICategory[] | null = null;

    if (categories.length) localizedDocs = this.categoryDao.toJSONLocalizedOnly(categories, reqLanguage) as ICategory[];

    return localizedDocs;
  }

  async getCategory(categoryId: string, reqLanguage: string): Promise<ICategory> {
    let category = await this.categoryDao.getOneById(categoryId, '', false);
    if (!category) throw new HttpException(404, 'No category found');
    return this.categoryDao.toJSONLocalizedOnly(category, reqLanguage) as ICategory;
  }

  async updateCategory(categoryId: string, category: ICategory) {
    let isCategoryExists = await this.categoryDao.getOneById(categoryId);
    if (!isCategoryExists) throw new HttpException(404, 'No category found');
    return await this.categoryDao.updateOneById(categoryId, category);
  }

  async uploadCategoryImage(categoryId: string, file: Express.Multer.File) {
    const result = await cloudinaryUploadImage(file.buffer, 'service-image');
    // update the category with the image url and public id
    let category = await this.categoryDao.getOneById(categoryId);
    if (!category) throw new HttpException(404, 'No category found');
    // delete the old image from cloudinary if exists
    if (category.image.publicId) await cloudinaryDeleteImage(category.image.publicId);
    // update the image field in the DB with the new image url and public id
    category = await this.categoryDao.updateOneById(categoryId, {
      image: { url: result.secure_url, publicId: result.public_id },
    } as ICategory);

    return category;
  }

  async deleteCategory(categoryId: string) {
    let isCategoryExists = await this.categoryDao.getOneById(categoryId);
    if (!isCategoryExists) throw new HttpException(404, 'No category found');
    return await this.categoryDao.deleteOneById(categoryId);
  }
}

export { CategoryService };
