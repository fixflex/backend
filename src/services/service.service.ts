import { autoInjectable } from 'tsyringe';

import ServiceDao from '../DB/dao/service.dao';
import HttpException from '../exceptions/HttpException';
import APIFeatures from '../helpers/apiFeatures';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../helpers/cloudinary';
import { IPagination } from '../interfaces/respons.interface';
import { IService } from '../interfaces/services.interface';
import { uploadSingleFile } from '../middleware/uploadImages.middleware';

export const uploadServiceImage = uploadSingleFile('image');
@autoInjectable()
class ServiceService {
  constructor(private readonly serviceDao: ServiceDao) {}
  async getServices(reqQuery: any): Promise<{
    services: IService[] | null;
    paginate: IPagination;
  }> {
    let apiFeatures = new APIFeatures(reqQuery);
    let query = apiFeatures.filter();
    let paginate = apiFeatures.paginate();
    let sort = apiFeatures.sort();
    let fields = apiFeatures.selectFields();

    let services = await this.serviceDao.listServices(query, paginate, sort, fields);
    if (services) paginate = apiFeatures.paginate(services.length); // update the pagination object with the total documents

    return { services, paginate };
  }

  async getService(serviceId: string) {
    return await this.serviceDao.getOneById(serviceId);
  }

  async createService(service: IService) {
    let isServiceExists = await this.serviceDao.getServiceByName(service.name);
    if (isServiceExists) {
      throw new HttpException(409, `Service ${service.name} is already exists, please pick a different one.`);
    }
    let newService = await this.serviceDao.create(service);
    return newService;
  }

  async updateService(serviceId: string, service: IService) {
    let isServiceExists = await this.serviceDao.getOneById(serviceId);
    if (!isServiceExists) throw new HttpException(404, 'No service found');
    return await this.serviceDao.updateOneById(serviceId, service);
  }

  async uploadServiceImage(serviceId: string, file: Express.Multer.File) {
    const result = await cloudinaryUploadImage(file.buffer, 'service-image');
    // update the service with the image url and public id
    let service = await this.serviceDao.getOneById(serviceId);
    if (!service) throw new HttpException(404, 'No service found');
    // delete the old image from cloudinary if exists
    if (service.image.publicId) await cloudinaryDeleteImage(service.image.publicId);
    // update the image field in the DB with the new image url and public id
    service = await this.serviceDao.updateOneById(serviceId, { image: { url: result.secure_url, publicId: result.public_id } } as IService);

    return service;
  }

  async deleteService(serviceId: string) {
    let isServiceExists = await this.serviceDao.getOneById(serviceId);
    if (!isServiceExists) throw new HttpException(404, 'No service found');
    return await this.serviceDao.deleteOneById(serviceId);
  }
}

export { ServiceService };
