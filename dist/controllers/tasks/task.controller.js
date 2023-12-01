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
exports.TaskController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tsyringe_1 = require("tsyringe");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const task_service_1 = require("../../services/tasks/task.service");
const customResponse_1 = __importDefault(require("../../utils/customResponse"));
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
        this.createTask = (0, express_async_handler_1.default)(async (req, res, next) => {
            req.body.ownerId = req.user?._id;
            const task = await this.taskService.createTask(req.body);
            if (!task)
                return next(new HttpException_1.default(400, 'Something went wrong, please try again later'));
            res.status(201).json((0, customResponse_1.default)({ data: task, success: true, status: 201, message: 'Task created', error: false }));
        });
        this.getTasks = (0, express_async_handler_1.default)(async (_req, res) => {
            const tasks = await this.taskService.getTasks();
            res.status(200).json((0, customResponse_1.default)({ data: tasks, success: true, status: 200, message: null, error: false }));
        });
        this.getTaskById = (0, express_async_handler_1.default)(async (req, res, next) => {
            const task = await this.taskService.getTaskById(req.params.id);
            if (!task)
                return next(new HttpException_1.default(404, `Task with id ${req.params.id} not found`));
            res.status(200).json((0, customResponse_1.default)({ data: task, success: true, status: 200, message: null, error: false }));
        });
        this.updateTask = (0, express_async_handler_1.default)(async (req, res, next) => {
            const task = await this.taskService.updateTask(req.params.id, req.body, req.user?._id);
            if (!task)
                return next(new HttpException_1.default(404, `Task with id ${req.params.id} not found`));
            res.status(200).json((0, customResponse_1.default)({ data: task, success: true, status: 200, message: 'Task updated', error: false }));
        });
        this.deleteTask = (0, express_async_handler_1.default)(async (req, res, next) => {
            const task = await this.taskService.deleteTask(req.params.id, req.user?._id);
            if (!task)
                return next(new HttpException_1.default(404, `Task with id ${req.params.id} not found`));
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, status: 204, message: 'Task deleted', error: false }));
        });
    }
};
exports.TaskController = TaskController;
exports.TaskController = TaskController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);