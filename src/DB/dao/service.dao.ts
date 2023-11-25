import { IService } from '../../interfaces/services.interface';
import ServiceModel from '../models/services.model';
import CommonDAO from './commonDAO';

class ServiceDao extends CommonDAO<IService> {
  constructor() {
    super(ServiceModel);
  }
  async getServiceByName(name: string): Promise<IService | null> {
    return await ServiceModel.findOne({ name }).lean();
  }

  async listServices(query: any = {}, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<IService[]> {
    // build the query
    let services = ServiceModel.find(query);
    if (paginate.skip) services = services.skip(paginate.skip);
    if (paginate.limit) services = services.limit(paginate.limit);
    services = services.sort(sort).select(select);
    // execute the query
    return await services.lean();
  }
}

export default ServiceDao;
