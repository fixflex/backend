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
exports.OfferService = void 0;
const tsyringe_1 = require("tsyringe");
const offer_dao_1 = require("../../DB/dao/offer.dao");
const task_dao_1 = require("../../DB/dao/task.dao");
const tasker_dao_1 = __importDefault(require("../../DB/dao/tasker.dao"));
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const task_interface_1 = require("../../interfaces/task.interface");
let OfferService = class OfferService {
    constructor(offerDao, taskerDao, taskDao) {
        this.offerDao = offerDao;
        this.taskerDao = taskerDao;
        this.taskDao = taskDao;
    }
    async createOffer(offer, userId) {
        // check if the current user is a tasker
        let tasker = await this.taskerDao.getOne({ userId });
        if (!tasker)
            throw new HttpException_1.default(400, 'You are not a tasker');
        // check if task exists
        let task = await this.taskDao.getOneById(offer.taskId);
        if (!task)
            throw new HttpException_1.default(400, 'Task not found');
        if (task.status !== task_interface_1.TaskStatus.OPEN)
            throw new HttpException_1.default(400, 'This task is not open for offers');
        offer.taskerId = tasker._id;
        return await this.offerDao.create(offer);
    }
    async getOfferById(id) {
        return await this.offerDao.getOneById(id);
    }
    async getOffers(taskId) {
        if (taskId)
            return await this.offerDao.getMany({ taskId });
        return await this.offerDao.getMany();
    }
    async updateOffer(id, payload, userId) {
        // check if this offer belongs to this tasker
        let tasker = await this.taskerDao.getOne({ userId });
        if (!tasker)
            throw new HttpException_1.default(400, 'You are not a tasker');
        let offer = await this.offerDao.getOneById(id);
        if (!offer)
            throw new HttpException_1.default(404, 'Offer not found');
        if (offer.taskerId.toString() !== tasker._id.toString())
            throw new HttpException_1.default(400, 'This offer is not yours');
        return await this.offerDao.updateOneById(id, payload);
    }
    async deleteOffer(id, userId) {
        //check if this offer belongs to this tasker
        let tasker = await this.taskerDao.getOne({ userId });
        if (!tasker)
            throw new HttpException_1.default(400, 'You are not a tasker');
        let offer = await this.offerDao.getOneById(id);
        if (!offer)
            throw new HttpException_1.default(404, 'Offer not found');
        if (offer.taskerId.toString() !== tasker._id.toString())
            throw new HttpException_1.default(400, 'This offer is not yours');
        return await this.offerDao.deleteOneById(id);
    }
};
exports.OfferService = OfferService;
exports.OfferService = OfferService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [offer_dao_1.OfferDao, tasker_dao_1.default, task_dao_1.TaskDao])
], OfferService);
