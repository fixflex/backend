"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const service_dao_1 = __importDefault(require("../DB/dao/service.dao"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
class ServiceService {
    async getServices(reqQuery) {
        let apiFeatures = new apiFeatures_1.default(reqQuery);
        let query = apiFeatures.filter();
        let paginate = apiFeatures.paginate();
        let sort = apiFeatures.sort();
        let fields = apiFeatures.selectFields();
        let services = await service_dao_1.default.listServices(query, paginate, sort, fields);
        if (services)
            paginate = apiFeatures.paginate(services.length); // update the pagination object with the total documents
        return { services, paginate };
    }
    async getService(serviceId) {
        return await service_dao_1.default.getServiceById(serviceId);
    }
    async createService(service) {
        let isServiceExists = await service_dao_1.default.getServiceByName(service.name);
        if (isServiceExists) {
            throw new HttpException_1.default(409, `Service ${service.name} is already exists, please pick a different one.`);
        }
        let newService = await service_dao_1.default.create(service);
        return newService;
    }
    async updateService(serviceId, service) {
        let isServiceExists = await service_dao_1.default.getServiceById(serviceId);
        if (!isServiceExists)
            throw new HttpException_1.default(404, 'No service found');
        return await service_dao_1.default.update(serviceId, service);
    }
    async deleteService(serviceId) {
        let isServiceExists = await service_dao_1.default.getServiceById(serviceId);
        if (!isServiceExists)
            throw new HttpException_1.default(404, 'No service found');
        return await service_dao_1.default.delete(serviceId);
    }
}
exports.ServiceService = ServiceService;
