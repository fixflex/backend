"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const fs_1 = __importDefault(require("fs"));
const service_dao_1 = __importDefault(require("../DB/dao/service.dao"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const cloudinary_1 = require("../utils/cloudinary");
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
    async uploadServiceImage(serviceId, file) {
        const filePath = `${file.path}`;
        const result = await (0, cloudinary_1.cloudinaryUploadImage)(filePath);
        // update the service with the image url and public id
        let service = await service_dao_1.default.getServiceById(serviceId);
        if (!service)
            throw new HttpException_1.default(404, 'No service found');
        // delete the old image from cloudinary if exists
        if (service.image.publicId)
            await (0, cloudinary_1.cloudinaryDeleteImage)(service.image.publicId);
        // update the image field in the DB with the new image url and public id
        service = await service_dao_1.default.update(serviceId, { image: { url: result.secure_url, publicId: result.public_id } });
        // remove the file from the server
        fs_1.default.unlinkSync(filePath);
        return service;
    }
    async deleteService(serviceId) {
        let isServiceExists = await service_dao_1.default.getServiceById(serviceId);
        if (!isServiceExists)
            throw new HttpException_1.default(404, 'No service found');
        return await service_dao_1.default.delete(serviceId);
    }
}
exports.ServiceService = ServiceService;
