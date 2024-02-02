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
exports.TaskerService = void 0;
const tsyringe_1 = require("tsyringe");
const dao_1 = require("../DB/dao");
const dao_2 = require("../DB/dao");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
let TaskerService = class TaskerService {
    constructor(categoryDao, taskerDao) {
        this.categoryDao = categoryDao;
        this.taskerDao = taskerDao;
    }
    async createTasker(userId, tasker) {
        // check if service is exists in DB
        await Promise.all(tasker.categories.map(async (service) => {
            let serviceExists = await this.categoryDao.getOneById(service);
            if (!serviceExists)
                throw new HttpException_1.default(404, 'category_not_found');
            return service;
        }));
        tasker.userId = userId;
        return await this.taskerDao.create(tasker);
    }
    async getTasker(taskerId) {
        return await this.taskerDao.getTaskerProfile(taskerId);
    }
    async getMyProfile(userId) {
        return await this.taskerDao.getOne({ userId });
    }
    async getTaskers(reqQuery) {
        const { taskers, pagination } = await this.taskerDao.getTaskers(reqQuery);
        return { pagination, taskers };
    }
    async updateTasker(userId, tasker) {
        if (tasker.categories)
            await Promise.all(tasker.categories.map(async (service) => {
                let serviceExists = await this.categoryDao.getOneById(service);
                if (!serviceExists)
                    throw new HttpException_1.default(404, 'category_not_found');
                return service;
            }));
        return await this.taskerDao.updateOne({ userId }, tasker);
    }
    async deleteTasker(userId) {
        return await this.taskerDao.deleteOne({ userId });
    }
};
exports.TaskerService = TaskerService;
exports.TaskerService = TaskerService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [dao_1.CategoryDao, dao_2.TaskerDao])
], TaskerService);
