import ServiceDao from '../../src/DB/dao/service.dao';
import HttpException from '../../src/exceptions/HttpException';
import { IPagination } from '../../src/interfaces/respons.interface';
import { IService } from '../../src/interfaces/services.interface';
import APIFeatures from '../../src/utils/apiFeatures';

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

  async deleteService(serviceId: string) {
    let isServiceExists = await ServiceDao.getServiceById(serviceId);
    if (!isServiceExists) throw new HttpException(404, 'No service found');
    return await ServiceDao.delete(serviceId);
  }
}

export { ServiceService };
