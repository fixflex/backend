import { autoInjectable } from 'tsyringe';

import { CategoryDao } from '../DB/dao/category.dao';
import HttpException from '../exceptions/HttpException';
import APIFeatures from '../helpers/apiFeatures';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../helpers/cloudinary';
import { ICategory, ICategoryService } from '../interfaces/category.interface';
import { IPagination } from '../interfaces/pagination.interface';
import { uploadSingleFile } from '../middleware/uploadImages.middleware';

export const uploadServiceImage = uploadSingleFile('image');
@autoInjectable()
class CategoryService implements ICategoryService {
  constructor(private readonly categoryDao: CategoryDao) {}
  async getCategories(reqQuery: any): Promise<{
    categories: ICategory[] | null;
    paginate: IPagination;
  }> {
    let apiFeatures = new APIFeatures(reqQuery);
    let query = apiFeatures.filter();
    let paginate = apiFeatures.paginate();
    let sort = apiFeatures.sort();
    let fields = apiFeatures.selectFields();

    let categories = await this.categoryDao.listServices(query, paginate, sort, fields);
    if (categories) paginate = apiFeatures.paginate(categories.length); // update the pagination object with the total documents

    return { categories: categories, paginate };
  }

  async getCategory(serviceId: string) {
    return await this.categoryDao.getOneById(serviceId);
  }

  async createCategory(service: ICategory) {
    let isServiceExists = await this.categoryDao.getServiceByName(service.name);
    if (isServiceExists) {
      throw new HttpException(409, `Service ${service.name} is already exists, please pick a different one.`);
    }
    let newService = await this.categoryDao.create(service);
    return newService;
  }

  async updateCategory(serviceId: string, service: ICategory) {
    let isServiceExists = await this.categoryDao.getOneById(serviceId);
    if (!isServiceExists) throw new HttpException(404, 'No service found');
    return await this.categoryDao.updateOneById(serviceId, service);
  }

  async uploadCategoryImage(serviceId: string, file: Express.Multer.File) {
    const result = await cloudinaryUploadImage(file.buffer, 'service-image');
    // update the service with the image url and public id
    let service = await this.categoryDao.getOneById(serviceId);
    if (!service) throw new HttpException(404, 'No service found');
    // delete the old image from cloudinary if exists
    if (service.image.publicId) await cloudinaryDeleteImage(service.image.publicId);
    // update the image field in the DB with the new image url and public id
    service = await this.categoryDao.updateOneById(serviceId, { image: { url: result.secure_url, publicId: result.public_id } } as ICategory);

    return service;
  }

  async deleteCategory(serviceId: string) {
    let isServiceExists = await this.categoryDao.getOneById(serviceId);
    if (!isServiceExists) throw new HttpException(404, 'No service found');
    return await this.categoryDao.deleteOneById(serviceId);
  }
}

export { CategoryService };