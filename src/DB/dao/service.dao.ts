import { IService } from '../../interfaces/services.interface';
import ServiceModel from '../models/services.model';

class ServiceDao {
  static async getServiceByName(name: string): Promise<IService | null> {
    return await ServiceModel.findOne({ name }).lean();
  }

  static async getServiceById(serviceId: string): Promise<IService | null> {
    return await ServiceModel.findById(serviceId).lean();
  }

  static async listServices(query: any = {}, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<IService[]> {
    // build the query
    let services = ServiceModel.find(query);
    if (paginate.skip) services = services.skip(paginate.skip);
    if (paginate.limit) services = services.limit(paginate.limit);
    services = services.sort(sort).select(select);
    // execute the query
    return await services.lean();
  }

  static async create(service: IService): Promise<IService> {
    return await ServiceModel.create(service);
  }

  static async update(serviceId: string, service: IService): Promise<IService | null> {
    return await ServiceModel.findByIdAndUpdate(serviceId, service, { new: true }).lean();
  }

  static async delete(serviceId: string): Promise<IService | null> {
    return await ServiceModel.findByIdAndDelete(serviceId).lean();
  }
}

export default ServiceDao;
