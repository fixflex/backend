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
exports.TaskService = void 0;
const tsyringe_1 = require("tsyringe");
const task_dao_1 = require("../../DB/dao/task.dao");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
let TaskService = class TaskService {
    constructor(taskDao) {
        this.taskDao = taskDao;
        this.getTasks = async () => {
            const tasks = await this.taskDao.getMany();
            return tasks;
        };
        this.getTaskById = async (id) => {
            const task = await this.taskDao.getOneById(id);
            return task;
        };
        this.createTask = async (task) => {
            const newTask = await this.taskDao.create(task);
            return newTask;
        };
        this.updateTask = async (id, payload, userId) => {
            // check if the user is the owner of the task
            const task = await this.taskDao.getOneById(id);
            if (!task)
                throw new HttpException_1.default(404, 'Task not found');
            // convert the id to string to compare it with the ownerId
            if (task.ownerId !== userId?.toString())
                throw new HttpException_1.default(403, 'You are not allowed to update this task');
            const updatedTask = await this.taskDao.updateOneById(id, payload);
            return updatedTask;
        };
        this.deleteTask = async (id, userId) => {
            const task = await this.taskDao.getOneById(id);
            if (!task)
                throw new HttpException_1.default(404, 'Task not found');
            if (task.ownerId !== userId?.toString())
                throw new HttpException_1.default(403, 'You are not allowed to update this task');
            const deletedTask = await this.taskDao.deleteOneById(id);
            return deletedTask;
        };
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [task_dao_1.TaskDao])
], TaskService);
