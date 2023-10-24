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
exports.TaskerController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const tasker_service_1 = require("../../services/users/tasker.service");
let TaskerController = class TaskerController {
    constructor(taskerService) {
        this.taskerService = taskerService;
        this.becomeTasker = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId = req.user?._id;
            let user = await this.taskerService.registerAsTasker(userId, req.body);
            if (!user)
                return next(new HttpException_1.default(400, 'Something went wrong, please try again later'));
            res.status(200).json({ data: user });
        });
        this.getTaskerProfile = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId;
            if (req.params.id)
                userId = req.params.id;
            else
                userId = req.user?._id;
            let user = await this.taskerService.getTaskerProfile(userId);
            if (!user)
                return next(new HttpException_1.default(400, 'Something went wrong, please try again later'));
            res.status(200).json({ data: user });
        });
        this.getListOfTaskers = (0, express_async_handler_1.default)(async (req, res, next) => {
            let taskers = await this.taskerService.getListOfTaskers(req.query);
            if (!taskers)
                return next(new HttpException_1.default(400, 'Something went wrong, please try again later'));
            res.status(200).json({ results: taskers.length, taskers });
        });
        this.updateMyTaskerProfile = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId = req.user?._id;
            let user = await this.taskerService.updateMyTaskerProfile(userId, req.body);
            if (!user)
                return next(new HttpException_1.default(400, 'Something went wrong, please try again later'));
            res.status(200).json({ data: user });
        });
        this.deleteMyTaskerProfile = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId = req.user?._id;
            let user = await this.taskerService.deleteMyTaskerProfile(userId);
            if (!user)
                return next(new HttpException_1.default(400, 'Something went wrong, please try again later'));
            res.status(200).json({ data: user });
        });
    }
};
exports.TaskerController = TaskerController;
exports.TaskerController = TaskerController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [tasker_service_1.TaskerService])
], TaskerController);