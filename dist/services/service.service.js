var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ServiceDao from '../DB/dao/service.dao';
import HttpException from '../exceptions/HttpException';
import APIFeatures from '../utils/apiFeatures';
class ServiceService {
    getServices(reqQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let apiFeatures = new APIFeatures(reqQuery);
            let query = apiFeatures.filter();
            let paginate = apiFeatures.paginate();
            let sort = apiFeatures.sort();
            let fields = apiFeatures.selectFields();
            let services = yield ServiceDao.listServices(query, paginate, sort, fields);
            if (services)
                paginate = apiFeatures.paginate(services.length); // update the pagination object with the total documents
            return { services, paginate };
        });
    }
    getService(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ServiceDao.getServiceById(serviceId);
        });
    }
    createService(service) {
        return __awaiter(this, void 0, void 0, function* () {
            let isServiceExists = yield ServiceDao.getServiceByName(service.name);
            if (isServiceExists) {
                throw new HttpException(409, `Service ${service.name} is already exists, please pick a different one.`);
            }
            let newService = yield ServiceDao.create(service);
            return newService;
        });
    }
    updateService(serviceId, service) {
        return __awaiter(this, void 0, void 0, function* () {
            let isServiceExists = yield ServiceDao.getServiceById(serviceId);
            if (!isServiceExists)
                throw new HttpException(404, 'No service found');
            return yield ServiceDao.update(serviceId, service);
        });
    }
    deleteService(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            let isServiceExists = yield ServiceDao.getServiceById(serviceId);
            if (!isServiceExists)
                throw new HttpException(404, 'No service found');
            return yield ServiceDao.delete(serviceId);
        });
    }
}
export { ServiceService };
