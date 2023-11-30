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
const service_dao_1 = __importDefault(require("../../DB/dao/service.dao"));
const tasker_dao_1 = __importDefault(require("../../DB/dao/tasker.dao"));
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
let TaskerService = class TaskerService {
    constructor(serviceDao, taskerDao) {
        this.serviceDao = serviceDao;
        this.taskerDao = taskerDao;
    }
    async createTasker(userId, tasker) {
        // check if service is exists in DB
        await Promise.all(tasker.services.map(async (service) => {
            let serviceExists = await this.serviceDao.getOneById(service);
            if (!serviceExists)
                throw new HttpException_1.default(404, `Service ID ${service} doesn't exist in DB`);
            return service;
        }));
        tasker.userId = userId;
        return await this.taskerDao.create(tasker);
    }
    async getTaskerProfile(taskerId) {
        return await this.taskerDao.getOneById(taskerId);
    }
    async getMyProfile(userId) {
        return await this.taskerDao.getOne({ userId });
    }
    async getListOfTaskers(reqQuery) {
        if (reqQuery.services) {
            // check if service is exists in DB
            let isServiceExists = await this.serviceDao.getOneById(reqQuery.services);
            if (!isServiceExists)
                throw new HttpException_1.default(404, `Service ID ${reqQuery.services} doesn't exist in DB`);
        }
        let taskers = await this.taskerDao.listTaskers(reqQuery.longitude, reqQuery.latitude, reqQuery.services, reqQuery.maxDistance);
        return taskers;
    }
    async updateMyTaskerProfile(userId, tasker) {
        if (tasker.services)
            await Promise.all(tasker.services.map(async (service) => {
                let serviceExists = await this.serviceDao.getOneById(service);
                if (!serviceExists)
                    throw new HttpException_1.default(404, `Service ID ${service} doesn't exist in DB`);
                return service;
            }));
        return await this.taskerDao.updateOne({ userId }, tasker);
    }
    async deleteMyTaskerProfile(userId) {
        return await this.taskerDao.deleteOne({ userId });
    }
};
exports.TaskerService = TaskerService;
exports.TaskerService = TaskerService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [service_dao_1.default, tasker_dao_1.default])
], TaskerService);
