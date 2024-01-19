"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = exports.uploadServiceImage = void 0;
const tsyringe_1 = require("tsyringe");
const service_dao_1 = __importDefault(require("../DB/dao/service.dao"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const apiFeatures_1 = __importDefault(require("../helpers/apiFeatures"));
const cloudinary_1 = require("../helpers/cloudinary");
const uploadImages_middleware_1 = require("../middleware/uploadImages.middleware");
exports.uploadServiceImage = (0, uploadImages_middleware_1.uploadSingleFile)('image');
let ServiceService = class ServiceService {
    constructor(serviceDao) {
        this.serviceDao = serviceDao;
    }
    async getServices(reqQuery) {
        let apiFeatures = new apiFeatures_1.default(reqQuery);
        let query = apiFeatures.filter();
        let paginate = apiFeatures.paginate();
        let sort = apiFeatures.sort();
        let fields = apiFeatures.selectFields();
        let services = await this.serviceDao.listServices(query, paginate, sort, fields);
        if (services)
            paginate = apiFeatures.paginate(services.length); // update the pagination object with the total documents
        return { services, paginate };
    }
    async getService(serviceId) {
        return await this.serviceDao.getOneById(serviceId);
    }
    async createService(service) {
        let isServiceExists = await this.serviceDao.getServiceByName(service.name);
        if (isServiceExists) {
            throw new HttpException_1.default(409, `Service ${service.name} is already exists, please pick a different one.`);
        }
        let newService = await this.serviceDao.create(service);
        return newService;
    }
    async updateService(serviceId, service) {
        let isServiceExists = await this.serviceDao.getOneById(serviceId);
        if (!isServiceExists)
            throw new HttpException_1.default(404, 'No service found');
        return await this.serviceDao.updateOneById(serviceId, service);
    }
    async uploadServiceImage(serviceId, file) {
        const result = await (0, cloudinary_1.cloudinaryUploadImage)(file.buffer, 'service-image');
        // update the service with the image url and public id
        let service = await this.serviceDao.getOneById(serviceId);
        if (!service)
            throw new HttpException_1.default(404, 'No service found');
        // delete the old image from cloudinary if exists
        if (service.image.publicId)
            await (0, cloudinary_1.cloudinaryDeleteImage)(service.image.publicId);
        // update the image field in the DB with the new image url and public id
        service = await this.serviceDao.updateOneById(serviceId, { image: { url: result.secure_url, publicId: result.public_id } });
        return service;
    }
    async deleteService(serviceId) {
        let isServiceExists = await this.serviceDao.getOneById(serviceId);
        if (!isServiceExists)
            throw new HttpException_1.default(404, 'No service found');
        return await this.serviceDao.deleteOneById(serviceId);
    }
};
exports.ServiceService = ServiceService;
exports.ServiceService = ServiceService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [service_dao_1.default])
], ServiceService);
