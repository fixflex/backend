import { autoInjectable } from 'tsyringe';

import ServiceDao from '../../src/DB/dao/service.dao';
import HttpException from '../../src/exceptions/HttpException';
import { IPagination } from '../../src/interfaces/respons.interface';
import { IService } from '../../src/interfaces/services.interface';
import APIFeatures from '../../src/utils/apiFeatures';

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
    return await this.serviceDao.getServiceById(serviceId);
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
    let isServiceExists = await this.serviceDao.getServiceById(serviceId);
    if (!isServiceExists) throw new HttpException(404, 'No service found');
    return await this.serviceDao.update(serviceId, service);
  }

  async deleteService(serviceId: string) {
    let isServiceExists = await this.serviceDao.getServiceById(serviceId);
    if (!isServiceExists) throw new HttpException(404, 'No service found');
    return await this.serviceDao.delete(serviceId);
  }
}

export { ServiceService };
