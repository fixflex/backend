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
exports.CategoryService = exports.uploadServiceImage = void 0;
const tsyringe_1 = require("tsyringe");
const category_dao_1 = require("../DB/dao/category.dao");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const cloudinary_1 = require("../helpers/cloudinary");
const uploadImages_middleware_1 = require("../middleware/uploadImages.middleware");
exports.uploadServiceImage = (0, uploadImages_middleware_1.uploadSingleFile)('image');
let CategoryService = class CategoryService {
    constructor(categoryDao) {
        this.categoryDao = categoryDao;
    }
    async createCategory(category) {
        let isServiceExists = await this.categoryDao.getCategoryByName(category.name);
        if (isServiceExists) {
            throw new HttpException_1.default(409, `Service ${category.name} is already exists, please pick a different one.`);
        }
        let newCategory = await this.categoryDao.create(category);
        // oneSignal create tag for the new category to add tasker who are interested in this category to the tag list to send them notifications
        return newCategory;
    }
    async getCategories(reqLanguage) {
        const categories = await this.categoryDao.getMany({}, '', false);
        let localizedDocs = null;
        if (categories.length)
            localizedDocs = this.categoryDao.toJSONLocalizedOnly(categories, reqLanguage);
        return localizedDocs;
    }
    async getCategory(serviceId, reqLanguage) {
        let category = await this.categoryDao.getOneById(serviceId, '', false);
        if (!category)
            throw new HttpException_1.default(404, 'No service found');
        return this.categoryDao.toJSONLocalizedOnly(category, reqLanguage);
    }
    async updateCategory(serviceId, service) {
        let isServiceExists = await this.categoryDao.getOneById(serviceId);
        if (!isServiceExists)
            throw new HttpException_1.default(404, 'No service found');
        return await this.categoryDao.updateOneById(serviceId, service);
    }
    async uploadCategoryImage(serviceId, file) {
        const result = await (0, cloudinary_1.cloudinaryUploadImage)(file.buffer, 'service-image');
        // update the service with the image url and public id
        let service = await this.categoryDao.getOneById(serviceId);
        if (!service)
            throw new HttpException_1.default(404, 'No service found');
        // delete the old image from cloudinary if exists
        if (service.image.publicId)
            await (0, cloudinary_1.cloudinaryDeleteImage)(service.image.publicId);
        // update the image field in the DB with the new image url and public id
        service = await this.categoryDao.updateOneById(serviceId, {
            image: { url: result.secure_url, publicId: result.public_id },
        });
        return service;
    }
    async deleteCategory(serviceId) {
        let isServiceExists = await this.categoryDao.getOneById(serviceId);
        if (!isServiceExists)
            throw new HttpException_1.default(404, 'No service found');
        return await this.categoryDao.deleteOneById(serviceId);
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [category_dao_1.CategoryDao])
], CategoryService);
