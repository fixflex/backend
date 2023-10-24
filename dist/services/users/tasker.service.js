"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskerService = void 0;
const service_dao_1 = __importDefault(require("../../DB/dao/service.dao"));
const tasker_dao_1 = __importDefault(require("../../DB/dao/tasker.dao"));
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
class TaskerService {
    async registerAsTasker(userId, tasker) {
        await Promise.all(tasker.services.map(async (service) => {
            let serviceExists = await service_dao_1.default.getServiceById(service);
            if (!serviceExists)
                throw new HttpException_1.default(404, `Service ID ${service} doesn't exist in DB`);
            return service;
        }));
        tasker.userId = userId;
        return await tasker_dao_1.default.create(tasker);
    }
    async getTaskerProfile(userId) {
        return await tasker_dao_1.default.getTaskerByUserId(userId);
    }
    async getListOfTaskers(reqQuery) {
        if (reqQuery.services) {
            // check if service is exists in DB
            let isServiceExists = await service_dao_1.default.getServiceById(reqQuery.services);
            if (!isServiceExists)
                throw new HttpException_1.default(404, `Service ID ${reqQuery.services} doesn't exist in DB`);
        }
        let taskers = await tasker_dao_1.default.listTaskers(reqQuery.longitude, reqQuery.latitude, reqQuery.services, reqQuery.maxDistance);
        return taskers;
    }
    async updateMyTaskerProfile(userId, tasker) {
        if (tasker.services)
            await Promise.all(tasker.services.map(async (service) => {
                let serviceExists = await service_dao_1.default.getServiceById(service);
                if (!serviceExists)
                    throw new HttpException_1.default(404, `Service ID ${service} doesn't exist in DB`);
                return service;
            }));
        return await tasker_dao_1.default.updateTaskerByUserId(userId, tasker);
    }
    async deleteMyTaskerProfile(userId) {
        return await tasker_dao_1.default.deleteTaskerByUserId(userId);
    }
}
exports.TaskerService = TaskerService;
