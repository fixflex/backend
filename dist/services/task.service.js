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
const task_dao_1 = require("../DB/dao/task.dao");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const cloudinary_1 = require("../helpers/cloudinary");
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
        this.uploadTaskImages = async (id, files, userId) => {
            // 1- check if the user is the owner of the task
            const task = await this.taskDao.getOneById(id);
            if (!task)
                throw new HttpException_1.default(404, 'Task not found');
            if (task.ownerId !== userId?.toString())
                throw new HttpException_1.default(403, 'You are not allowed to update this task');
            // 2- upload the images to cloudinary
            // 2.1- upload the cover image to cloudinary
            const imageCover = await (0, cloudinary_1.cloudinaryUploadImage)(files.imageCover[0].buffer, 'task-image');
            // 2.2- upload the images to cloudinary
            const images = await Promise.all(files.image.map(async (img) => await (0, cloudinary_1.cloudinaryUploadImage)(img.buffer, 'task-image')));
            // 3- delete the old images from cloudinary
            // 3.1- delete the old cover image from cloudinary
            if (task.imageCover.publicId)
                await (0, cloudinary_1.cloudinaryDeleteImage)(task.imageCover.publicId);
            if (task.images.length > 0)
                await Promise.all(task.images.map(async (img) => {
                    if (img.publicId)
                        return await (0, cloudinary_1.cloudinaryDeleteImage)(img.publicId);
                    // 3.2- delete the old images from cloudinary
                }));
            // 4- update the task with the new cover image and images
            const updatedTask = await this.taskDao.updateOneById(id, {
                imageCover: { url: imageCover.secure_url, publicId: imageCover.public_id },
                images: images.map(img => {
                    return { url: img.secure_url, publicId: img.public_id };
                }),
            });
            // 5- return the updated task
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
