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
const dao_1 = require("../DB/dao");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const cloudinary_1 = require("../helpers/cloudinary");
const onesignal_1 = require("../helpers/onesignal");
const interfaces_1 = require("../interfaces");
const transaction_interface_1 = require("../interfaces/transaction.interface");
let TaskService = class TaskService {
    constructor(taskDao, categoryDao, offerDao, taskerDao, oneSignalApiHandler) {
        this.taskDao = taskDao;
        this.categoryDao = categoryDao;
        this.offerDao = offerDao;
        this.taskerDao = taskerDao;
        this.oneSignalApiHandler = oneSignalApiHandler;
        this.taskPopulate = {
            path: 'userId offers',
            select: '-__v -password -active -role',
        };
        this.createTask = async (task) => {
            // if there is categoryId, check if it exists
            if (task.categoryId) {
                const category = await this.categoryDao.getOneById(task.categoryId);
                if (!category)
                    throw new HttpException_1.default(404, 'Category not found');
            }
            const newTask = await this.taskDao.create(task);
            // send push notification to all taskers where the task is in their service area and the task category is in their categories list
            let query = {
                location: `${task.location.coordinates[0]},${task.location.coordinates[1]}`,
                categories: task.categoryId,
                maxDistance: '60',
            };
            let taskers = await this.taskerDao.getTaskers(query);
            // loop through the taskers and collect their userIds and but them in an array of external_ids to send the push notification to them
            // @ts-ignore // TODO: fix the taskersIds type
            let taskersIds = taskers.taskers.map(tasker => tasker.userId._id.toString());
            // console.log(taskersIds);
            // send push notification to the taskers
            let notificationOptions = {
                headings: { en: 'New Task' },
                contents: { en: 'A new task is available' },
                data: { task: task._id },
                external_ids: taskersIds,
            };
            // let notification =
            await this.oneSignalApiHandler.createNotification(notificationOptions);
            // console.log(notification);
            return newTask;
        };
        this.getTasks = async (query) => {
            const { tasks, pagination } = await this.taskDao.getTasks(query);
            return { pagination, tasks };
        };
        this.getTaskById = async (id) => {
            let task = await this.taskDao.getOneByIdPopulate(id, this.taskPopulate);
            return task;
        };
        this.updateTask = async (id, payload, userId) => {
            // check if the user is the owner of the task
            const task = await this.taskDao.getOneById(id);
            if (!task)
                throw new HttpException_1.default(404, 'Task not found');
            // convert the id to string to compare it with the userId
            if (task.userId !== userId?.toString())
                throw new HttpException_1.default(403, 'unauthorized');
            const updatedTask = await this.taskDao.updateOneById(id, payload);
            return updatedTask;
        };
        this.uploadTaskImages = async (id, files, userId) => {
            // 1. Check if files are uploaded
            if (!files.imageCover && !files.image)
                throw new HttpException_1.default(400, 'file_not_found');
            // 2. Check if the task exists and the user is the owner of the task
            const task = await this.taskDao.getOneById(id);
            if (!task)
                throw new HttpException_1.default(404, 'Task not found');
            if (task.userId !== userId?.toString())
                throw new HttpException_1.default(403, 'unauthorized');
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
            if (task.userId !== userId?.toString())
                throw new HttpException_1.default(403, 'unauthorized');
            const deletedTask = await this.taskDao.deleteOneById(id);
            return deletedTask;
        };
        // ==================== offer status ==================== //
        this.cancelTask = async (id, userId) => {
            // 1. Check if the task exists
            let task = await this.taskDao.getOneByIdPopulate(id, { path: 'acceptedOffer', select: '-__v' }, '', false);
            if (!task)
                throw new HttpException_1.default(404, 'resource_not_found');
            // 2. Check if the user is the owner of the task
            if (task.userId !== userId.toString())
                throw new HttpException_1.default(403, 'forbidden');
            // 3. Check if the task is not canceled or completed
            if (task.status === interfaces_1.TaskStatus.CANCELLED || task.status === interfaces_1.TaskStatus.COMPLETED)
                throw new HttpException_1.default(400, 'bad_request');
            // 4. Check if the task status is ASSIGNED
            if (task.status === interfaces_1.TaskStatus.ASSIGNED) {
                // TODO: send notification to the tasker who his offer is accepted that the task is canceled
                let tasker = await this.taskerDao.getOneById(task.acceptedOffer.taskerId, '', false);
                console.log(tasker);
                let notificationOptions = {
                    headings: { en: 'Task Canceled' },
                    contents: { en: 'The task is canceled' },
                    data: { task: task._id },
                    external_ids: [tasker.userId],
                };
                // let notification =
                await this.oneSignalApiHandler.createNotification(notificationOptions);
                // console.log(notification);
            }
            // 5. Update the task status to CANCELED
            task.status = interfaces_1.TaskStatus.CANCELLED;
            return await task.save();
        };
        this.openTask = async (id, userId) => {
            // 1. Check if the task exists
            let task = await this.taskDao.getOneById(id, '', false);
            if (!task)
                throw new HttpException_1.default(404, 'resource_not_found');
            // 2. Check if the user is the owner of the task
            if (task.userId !== userId.toString())
                throw new HttpException_1.default(403, 'forbidden');
            // 3. Check if the task is not completed or
            if (task.status === interfaces_1.TaskStatus.COMPLETED || task.status === interfaces_1.TaskStatus.CANCELLED)
                throw new HttpException_1.default(400, 'bad_request');
            // 4. if the task is ASSIGNED then remove the acceptedOffer and update the task status to OPEN and update the offers status to PENDING instead of ACCEPTED
            if (task.status === interfaces_1.TaskStatus.ASSIGNED) {
                await this.offerDao.updateOneById(task.acceptedOffer, { status: interfaces_1.OfferStatus.PENDING });
                // await this.offerDao.updateMany({ _id: { $in: task.offers } }, { status: OfferStatus.PENDING });
            }
            task.acceptedOffer = undefined;
            task.status = interfaces_1.TaskStatus.OPEN;
            await task.save();
            return task;
        };
        this.completeTask = async (id, userId) => {
            // Step 1: Check if the task exists
            const task = await this.taskDao.getOneByIdPopulate(id, { path: 'acceptedOffer', select: '-__v' }, '', false);
            if (!task)
                throw new HttpException_1.default(404, 'resource_not_found');
            // Step 2: Check if the user is the owner of the task
            if (task.userId !== userId.toString())
                throw new HttpException_1.default(403, 'forbidden');
            // Step 3: Check if the task is assigned to a tasker and not completed or canceled
            if (task.status === interfaces_1.TaskStatus.CANCELLED || task.status === interfaces_1.TaskStatus.COMPLETED)
                throw new HttpException_1.default(400, 'task is already completed or canceled');
            if (task.status !== interfaces_1.TaskStatus.ASSIGNED)
                throw new HttpException_1.default(400, 'bad_request');
            // Step 4: Get the tasker who has the accepted offer
            const tasker = await this.taskerDao.getOneById(task.acceptedOffer.taskerId, '', false);
            if (!tasker)
                throw new HttpException_1.default(404, 'resource_not_found');
            // Step 5: Handle the task payment method
            if (task.paymentMethod === transaction_interface_1.PaymentMethod.CASH) {
                const commission = parseFloat((task.acceptedOffer.price * tasker.commissionRate).toFixed(2));
                task.commission = commission;
                tasker.notPaidTasks.push(task._id);
            }
            // TODO: Implement online payment method
            // Step 6: Update tasker's earnings and completed tasks
            tasker.totalEarnings += task.acceptedOffer.price;
            tasker.netEarnings = (tasker.netEarnings || 0) + (task.acceptedOffer.price - task.commission);
            tasker.completedTasks.push(task._id);
            // Step 7: Update task status to COMPLETED
            task.status = interfaces_1.TaskStatus.COMPLETED;
            console.log(tasker.userId, task.userId);
            // Step 8: Save changes and return the updated task
            await Promise.all([task.save(), tasker.save()]);
            // Step 9.1 Send push notification to the tasker that the task is completed and the payment is pending
            let notificationOptionsTasker = {
                headings: { en: 'Task Completed' },
                contents: { en: 'The task is completed and the payment is pending' },
                data: { task: task._id },
                external_ids: [tasker.userId],
            };
            // 9.2 Send push notification to the task owner that the task is completed and the payment is pending , thank him for using the app and ask him to rate the tasker, rate the app and share the app with his friends , rate the tasker and the app and share the app with his friends
            let notificationOptionsUser = {
                headings: { en: 'Task Completed' },
                contents: { en: 'Thank you for using the app' },
                data: { task: task._id },
                external_ids: [task.userId],
            };
            // wait for both notifications to be sent and log the results
            let [notificationTasker, notificationUser] = await Promise.all([
                this.oneSignalApiHandler.createNotification(notificationOptionsTasker),
                this.oneSignalApiHandler.createNotification(notificationOptionsUser),
            ]);
            console.log(notificationTasker, notificationUser);
            return task;
        };
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [dao_1.TaskDao,
        dao_1.CategoryDao,
        dao_1.OfferDao,
        dao_1.TaskerDao,
        onesignal_1.OneSignalApiHandler])
], TaskService);
