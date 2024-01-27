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
        this.getTasks = async (query) => {
            const tasks = await this.taskDao.getTasks(query);
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
            // 1. Check if files are uploaded
            if (!files.imageCover && !files.image)
                throw new HttpException_1.default(400, 'Please upload files');
            // 2. Check if the task exists and the user is the owner of the task
            const task = await this.taskDao.getOneById(id);
            if (!task)
                throw new HttpException_1.default(404, 'Task not found');
            if (task.ownerId !== userId?.toString())
                throw new HttpException_1.default(403, 'You are not allowed to update this task');
            let imageCover;
            let images;
            const updateData = {};
            // 3. Upload image cover if provided
            if (files.imageCover) {
                // 3.1 Upload image cover to cloudinary
                imageCover = await (0, cloudinary_1.cloudinaryUploadImage)(files.imageCover[0].buffer, 'task-image');
                // 3.2 Delete the old image cover from cloudinary if it exists
                if (task.imageCover.publicId)
                    await (0, cloudinary_1.cloudinaryDeleteImage)(task.imageCover.publicId);
                // 3.3 Update the task with the new image cover data
                updateData.imageCover = { url: imageCover.secure_url, publicId: imageCover.public_id };
            }
            // 4. Upload images if provided
            if (files.image) {
                // 4.1 Upload each image to cloudinary and store the results
                images = await Promise.all(files.image.map(async (img) => await (0, cloudinary_1.cloudinaryUploadImage)(img.buffer, 'task-image')));
                // 4.2 Delete the old images from cloudinary if they exist
                if (task.images.length > 0) {
                    await Promise.all(task.images.map(async (img) => {
                        if (img.publicId)
                            return await (0, cloudinary_1.cloudinaryDeleteImage)(img.publicId);
                    }));
                }
                // 4.3 Update the task with the new image data
                updateData.images = images.map(img => {
                    return { url: img.secure_url, publicId: img.public_id };
                });
            }
            // 5. Update the task with the new data
            let updatedTask = await this.taskDao.updateOneById(id, updateData);
            // 6. Return the updated task
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
// uploadTaskImages = async (id: string, files: { [fieldname: string]: Express.Multer.File[] }, userId: string) => {
//   // 1- check if files are uploaded
//   if (!files.imageCover && !files.image) throw new HttpException(400, 'Please upload files');
//   const task = await this.taskDao.getOneById(id);
//   if (!task) throw new HttpException(404, 'Task not found');
//   if (task.ownerId !== userId?.toString()) throw new HttpException(403, 'You are not allowed to update this task');
//   let imageCover: UploadApiResponse;
//   let images: UploadApiResponse[];
//   const updateData: any = {};
//   if ((files as { [fieldname: string]: Express.Multer.File[] }).imageCover) {
//     imageCover = await cloudinaryUploadImage((files as { [fieldname: string]: Express.Multer.File[] }).imageCover[0].buffer, 'task-image');
//     if (task.imageCover.publicId) await cloudinaryDeleteImage(task.imageCover.publicId);
//     updateData.imageCover = { url: imageCover.secure_url, publicId: imageCover.public_id };
//   }
//   if ((files as { [fieldname: string]: Express.Multer.File[] }).image) {
//     images = await Promise.all(
//       (files as { [fieldname: string]: Express.Multer.File[] }).image.map(async (img: Express.Multer.File) => await cloudinaryUploadImage(img.buffer, 'task-image'))
//     );
//     if (task.images.length > 0)
//       await Promise.all(
//         task.images.map(async img => {
//           if (img.publicId) return await cloudinaryDeleteImage(img.publicId);
//           // 3.2- delete the old images from cloudinary
//         })
//       );
//     updateData.images = images.map(img => {
//       return { url: img.secure_url, publicId: img.public_id };
//     });
//   }
//   let updatedTask = await this.taskDao.updateOneById(id, updateData);
//   return updatedTask;
// };
