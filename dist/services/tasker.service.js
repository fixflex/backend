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
const transaction_interface_1 = require("../interfaces/transaction.interface");
const paymob_service_1 = require("./paymob.service");
let TaskerService = class TaskerService {
    constructor(categoryDao, taskerDao, couponeDao, taskDao, paymobService) {
        this.categoryDao = categoryDao;
        this.taskerDao = taskerDao;
        this.couponeDao = couponeDao;
        this.taskDao = taskDao;
        this.paymobService = paymobService;
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
        return await this.taskerDao.getOnePopulate({ userId }, { path: 'reviews', select: '-__v' });
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
            throw new HttpException_1.default(404, 'coupon_not_found_or_expired');
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
    // ====================== payment ====================== //
    async checkout(user, payload) {
        let tasker = await this.taskerDao.getOne({ userId: user._id }, false);
        if (!tasker)
            throw new HttpException_1.default(404, 'tasker_not_found');
        let totalCommissions = 0;
        const totalCommissionsPromises = tasker.notPaidTasks.map(async (taskId) => {
            let task = await this.taskDao.getOneById(taskId);
            if (task) {
                return task.commissionAfterDescount ? task.commissionAfterDescount : task.commission;
            }
            return 0; // return 0 if task is not found
        });
        // wait for all promises to resolve and get the total commissions
        totalCommissions = (await Promise.all(totalCommissionsPromises)).reduce((a, b) => a + b, 0); // a is the accumulator and  b is the current value of array's element 0 is the initial value of the accumulator
        // i want to generat 6 rundom numbers and add the tasker id to it to make it unique :
        let orderDetails = {
            user,
            amount: totalCommissions,
            taskId: '',
            taskerId: `${Math.floor(100000 + Math.random() * 90000)}-${tasker._id.toString()}`,
            transactionType: transaction_interface_1.TransactionType.COMMISSION_PAYMENT,
            phoneNumber: payload.phoneNumber ? payload.phoneNumber : tasker.phoneNumber,
            merchant_order_id: tasker._id.toString(),
        };
        if (totalCommissions <= 0)
            throw new HttpException_1.default(400, 'no_commissions_to_pay');
        let paymentLink = '';
        if (payload.paymentMethod === 'wallet') {
            // step 6.1: check if there phone number in the payload object
            if (!payload.phoneNumber)
                throw new HttpException_1.default(400, 'phone_number_required');
            // step 6.2: call the paymob service to create the order and get the payment key
            paymentLink = await this.paymobService.initiateWalletPayment(orderDetails);
            console.log('paymentLink ====================> ', paymentLink);
            // step 6.3: return the payment link
            return paymentLink;
        }
        else if (payload.paymentMethod === 'card') {
            // step 6.4: call the paymob service to create the order and get the payment key
            paymentLink = await this.paymobService.initiateCardPayment(orderDetails);
            console.log('paymentLink ====================> ', paymentLink);
            // step 6.5: return the payment link
            return paymentLink;
        }
        throw new HttpException_1.default(400, 'invalid_payment_method');
    }
};
exports.TaskerService = TaskerService;
exports.TaskerService = TaskerService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [dao_1.CategoryDao,
        dao_2.TaskerDao,
        dao_1.CouponDao,
        dao_1.TaskDao,
        paymob_service_1.PaymobService])
], TaskerService);
