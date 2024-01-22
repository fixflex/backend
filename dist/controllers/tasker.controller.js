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
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const customResponse_1 = __importDefault(require("../helpers/customResponse"));
const tasker_service_1 = require("../services/tasker.service");
let TaskerController = class TaskerController {
    constructor(taskerService) {
        this.taskerService = taskerService;
        this.createTasker = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId = req.user?._id;
            let user = await this.taskerService.createTasker(userId, req.body);
            if (!user)
                return next(new HttpException_1.default(400, 'Something went wrong, please try again later'));
            res.status(201).json((0, customResponse_1.default)({ data: user, success: true, status: 200, message: 'tasker created', error: false }));
        });
        this.getTaskerPublicProfile = (0, express_async_handler_1.default)(async (req, res, next) => {
            let taskerId;
            taskerId = req.params.id;
            let tasker = await this.taskerService.getTasker(taskerId);
            if (!tasker)
                return next(new HttpException_1.default(404, `The tasker with id ${taskerId} doesn't exist`));
            res.status(200).json((0, customResponse_1.default)({ data: tasker, success: true, status: 200, message: 'tasker found', error: false }));
        });
        // get tasker profile by user id
        this.getMe = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId = req.user?._id;
            let tasker = await this.taskerService.getMyProfile(userId);
            if (!tasker)
                return next(new HttpException_1.default(404, `You don't have a tasker profile`));
            res.status(200).json((0, customResponse_1.default)({ data: tasker, success: true, status: 200, message: null, error: false }));
        });
        this.getTaskers = (0, express_async_handler_1.default)(async (req, res, next) => {
            let taskers = await this.taskerService.getTaskers(req.query);
            if (!taskers)
                return next(new HttpException_1.default(400, 'Something went wrong, please try again later'));
            res.status(200).json(Object.assign({ results: taskers.length }, (0, customResponse_1.default)({ data: taskers, success: true, status: 200, message: null, error: false })));
        });
        this.updateMe = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId = req.user?._id;
            let updatedTasker = await this.taskerService.updateTasker(userId, req.body);
            console.log(updatedTasker);
            if (updatedTasker.modifiedCount == 0)
                return next(new HttpException_1.default(404, `You don't have a tasker profile`));
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, error: false, message: 'Tasker updated', status: 200 }));
        });
        this.deleteTasker = (0, express_async_handler_1.default)(async (req, res, next) => {
            let userId = req.user?._id; //
            let user = await this.taskerService.deleteTasker(userId);
            if (user.deletedCount == 0)
                return next(new HttpException_1.default(404, `You don't have a tasker profile`));
            res.status(204).json((0, customResponse_1.default)({ data: null, success: true, error: false, message: 'User deleted', status: 204 }));
        });
    }
};
exports.TaskerController = TaskerController;
exports.TaskerController = TaskerController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [tasker_service_1.TaskerService])
], TaskerController);