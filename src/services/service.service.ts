import fs from 'fs';

import ServiceDao from '../DB/dao/service.dao';
import HttpException from '../exceptions/HttpException';
import { IPagination } from '../interfaces/respons.interface';
import { IService } from '../interfaces/services.interface';
import APIFeatures from '../utils/apiFeatures';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../utils/cloudinary';

class ServiceService {
  async getServices(reqQuery: any): Promise<{
    services: IService[] | null;
    paginate: IPagination;
  }> {
    let apiFeatures = new APIFeatures(reqQuery);
    let query = apiFeatures.filter();
    let paginate = apiFeatures.paginate();
    let sort = apiFeatures.sort();
    let fields = apiFeatures.selectFields();

    let services = await ServiceDao.listServices(query, paginate, sort, fields);
    if (services) paginate = apiFeatures.paginate(services.length); // update the pagination object with the total documents

    return { services, paginate };
  }

  async getService(serviceId: string) {
    return await ServiceDao.getServiceById(serviceId);
  }

  async createService(service: IService) {
    let isServiceExists = await ServiceDao.getServiceByName(service.name);
    if (isServiceExists) {
      throw new HttpException(409, `Service ${service.name} is already exists, please pick a different one.`);
    }
    let newService = await ServiceDao.create(service);
    return newService;
  }

  async updateService(serviceId: string, service: IService) {
    let isServiceExists = await ServiceDao.getServiceById(serviceId);
    if (!isServiceExists) throw new HttpException(404, 'No service found');
    return await ServiceDao.update(serviceId, service);
  }

  async uploadServiceImage(serviceId: string, file: Express.Multer.File) {
    const filePath = `${file.path}`;
    const result = await cloudinaryUploadImage(filePath);
    // update the service with the image url and public id
    let service = await ServiceDao.getServiceById(serviceId);
    if (!service) throw new HttpException(404, 'No service found');
    // delete the old image from cloudinary if exists
    if (service.image.publicId) await cloudinaryDeleteImage(service.image.publicId);
    // update the image field in the DB with the new image url and public id
    service = await ServiceDao.update(serviceId, { image: { url: result.secure_url, publicId: result.public_id } } as IService);

    // remove the file from the server
    fs.unlinkSync(filePath);
    return service;
  }

  async deleteService(serviceId: string) {
    let isServiceExists = await ServiceDao.getServiceById(serviceId);
    if (!isServiceExists) throw new HttpException(404, 'No service found');
    return await ServiceDao.delete(serviceId);
  }
}

export { ServiceService };
