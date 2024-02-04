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
    constructor(categoryDao, taskerDao, couponeDao, taskDao) {
        this.categoryDao = categoryDao;
        this.taskerDao = taskerDao;
        this.couponeDao = couponeDao;
        this.taskDao = taskDao;
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
    async applyCoupon(userId, couponCode) {
        // step 1: check user is tasker
        let tasker = await this.taskerDao.getOne({ userId }, false);
        if (!tasker)
            throw new HttpException_1.default(404, 'tasker_not_found');
        // step 2: check coupon is exists & valid
        let coupon = await this.couponeDao.getOne({ code: couponCode, expirationDate: { $gte: new Date() }, remainingUses: { $gt: 0 } }, false);
        if (!coupon)
            throw new HttpException_1.default(404, 'coupon_not_found');
        // step 3: apply coupon to tasker
        tasker.notPaidTasks.forEach(async (taskId) => {
            let task = await this.taskDao.getOneById(taskId, '', false);
            if (task) {
                task.commissionAfterDescount = task.commission - (task.commission * coupon.value) / 100;
                if (task.commissionAfterDescount <= 0) {
                    // remove task from notPaidTasks
                    tasker.notPaidTasks = tasker.notPaidTasks.filter(t => t != taskId);
                    await Promise.all([task.save(), tasker.save()]);
                }
                else
                    await task.save();
            }
        });
        coupon.remainingUses--;
        await coupon.save();
        return true;
    }
};
exports.TaskerService = TaskerService;
exports.TaskerService = TaskerService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [dao_1.CategoryDao,
        dao_2.TaskerDao,
        dao_1.CouponDao,
        dao_1.TaskDao])
], TaskerService);
