import { UploadApiResponse } from 'cloudinary';
import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { CategoryDao, OfferDao, TaskDao, TaskerDao } from '../DB/dao';
import HttpException from '../exceptions/HttpException';
import { IPopulate } from '../helpers';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../helpers/cloudinary';
import { NotificationOptions, OneSignalApiHandler } from '../helpers/onesignal';
import { IPagination, ITask, ITaskService, OfferStatus, TaskStatus } from '../interfaces';
import { PaymentMethod } from '../interfaces/transaction.interface';

@autoInjectable()
class TaskService implements ITaskService {
  constructor(
    private readonly taskDao: TaskDao,
    private readonly categoryDao: CategoryDao,
    private readonly offerDao: OfferDao,
    private readonly taskerDao: TaskerDao,
    private readonly oneSignalApiHandler: OneSignalApiHandler
  ) {}

  private taskPopulate: IPopulate = {
    path: 'userId offers',
    select: '-__v -password -active -role',
  };

  createTask = async (task: ITask) => {
    // if there is categoryId, check if it exists
    if (task.categoryId) {
      const category = await this.categoryDao.getOneById(task.categoryId);
      if (!category) throw new HttpException(404, 'Category not found');
    }
    const newTask = await this.taskDao.create(task);
    // send push notification to all taskers where the task is in their service area and the task category is in their categories list

    let query: Query = {
      location: `${task.location.coordinates[0]},${task.location.coordinates[1]}`,
      categories: task.categoryId,
      maxDistance: '60',
    };
    let taskers = await this.taskerDao.getTaskers(query);
    // loop through the taskers and collect their userIds and but them in an array of external_ids to send the push notification to them
    // @ts-ignore
    let taskersIds = taskers.taskers.map(tasker => tasker.userId._id.toString());
    // console.log(taskersIds);

    // send push notification to the taskers
    let notificationOptions: NotificationOptions = {
      headings: { en: 'New Task' },
      contents: { en: 'A new task is available' },
      data: { task: task._id }, // send the task id to the tasker to use it to navigate to the task details
      external_ids: taskersIds,
    };

    let notification = await this.oneSignalApiHandler.createNotification(notificationOptions);
    console.log(notification);

    return newTask;
  };

  getTasks = async (query: Query): Promise<{ tasks: ITask[]; pagination: IPagination | undefined }> => {
    const { tasks, pagination } = await this.taskDao.getTasks(query);
    return { pagination, tasks };
  };

  getTaskById = async (id: string) => {
    let task = await this.taskDao.getOneByIdPopulate(id, this.taskPopulate);
    return task;
  };

  updateTask = async (id: string, payload: ITask, userId: string) => {
    // check if the user is the owner of the task
    const task = await this.taskDao.getOneById(id);

    if (!task) throw new HttpException(404, 'Task not found');
    // convert the id to string to compare it with the userId
    if (task.userId !== userId?.toString()) throw new HttpException(403, 'unauthorized');
    const updatedTask = await this.taskDao.updateOneById(id, payload);
    return updatedTask;
  };

  uploadTaskImages = async (id: string, files: { [fieldname: string]: Express.Multer.File[] }, userId: string) => {
    // 1. Check if files are uploaded
    if (!files.imageCover && !files.image) throw new HttpException(400, 'file_not_found');

    // 2. Check if the task exists and the user is the owner of the task
    const task = await this.taskDao.getOneById(id);
    if (!task) throw new HttpException(404, 'Task not found');
    if (task.userId !== userId?.toString()) throw new HttpException(403, 'unauthorized');

    let imageCover: UploadApiResponse;
    let images: UploadApiResponse[];
    const updateData: any = {};

    // 3. Upload image cover if provided
    if (files.imageCover) {
      // 3.1 Upload image cover to cloudinary
      imageCover = await cloudinaryUploadImage(files.imageCover[0].buffer, 'task-image');

      // 3.2 Delete the old image cover from cloudinary if it exists
      if (task.imageCover.publicId) await cloudinaryDeleteImage(task.imageCover.publicId);

      // 3.3 Update the task with the new image cover data
      updateData.imageCover = { url: imageCover.secure_url, publicId: imageCover.public_id };
    }

    // 4. Upload images if provided
    if (files.image) {
      // 4.1 Upload each image to cloudinary and store the results
      images = await Promise.all(
        files.image.map(async (img: Express.Multer.File) => await cloudinaryUploadImage(img.buffer, 'task-image'))
      );

      // 4.2 Delete the old images from cloudinary if they exist
      if (task.images.length > 0) {
        await Promise.all(
          task.images.map(async img => {
            if (img.publicId) return await cloudinaryDeleteImage(img.publicId);
          })
        );
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

  deleteTask = async (id: string, userId: string) => {
    const task = await this.taskDao.getOneById(id);
    if (!task) throw new HttpException(404, 'Task not found');
    if (task.userId !== userId?.toString()) throw new HttpException(403, 'unauthorized');
    const deletedTask = await this.taskDao.deleteOneById(id);
    return deletedTask;
  };

  // ==================== offer status ==================== //

  cancelTask = async (id: string, userId: string) => {
    // 1. Check if the task exists
    let task = await this.taskDao.getOneById(id, '', false);
    if (!task) throw new HttpException(404, 'resource_not_found');
    // 2. Check if the user is the owner of the task
    if (task.userId !== userId.toString()) throw new HttpException(403, 'forbidden');
    // 3. Check if the task is not canceled or completed
    if (task.status === TaskStatus.CANCELLED || task.status === TaskStatus.COMPLETED) throw new HttpException(400, 'bad_request');
    // 4. Check if the task status is ASSIGNED
    if (task.status === TaskStatus.ASSIGNED) {
      // TODO: send notification to the tasker who his offer is accepted that the task is canceled
    }
    // 5. Update the task status to CANCELED
    task.status = TaskStatus.CANCELLED;
    task = await task.save();
    return task;
  };

  openTask = async (id: string, userId: string) => {
    // 1. Check if the task exists
    let task = await this.taskDao.getOneById(id, '', false);
    if (!task) throw new HttpException(404, 'resource_not_found');
    // 2. Check if the user is the owner of the task
    if (task.userId !== userId.toString()) throw new HttpException(403, 'forbidden');
    // 3. Check if the task is not completed or
    if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED) throw new HttpException(400, 'bad_request');
    // 4. if the task is ASSIGNED then remove the acceptedOffer and update the task status to OPEN and update the offers status to PENDING instead of ACCEPTED
    if (task.status === TaskStatus.ASSIGNED) {
      await this.offerDao.updateOneById(task.acceptedOffer as string, { status: OfferStatus.PENDING });
      // await this.offerDao.updateMany({ _id: { $in: task.offers } }, { status: OfferStatus.PENDING });
    }

    task.acceptedOffer = undefined;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  };

  completeTask = async (id: string, userId: string) => {
    // Step 1: Check if the task exists
    const task = await this.taskDao.getOneByIdPopulate(id, { path: 'acceptedOffer', select: '-__v' }, '', false);
    if (!task) throw new HttpException(404, 'resource_not_found');

    // Step 2: Check if the user is the owner of the task
    if (task.userId !== userId.toString()) throw new HttpException(403, 'forbidden');

    // Step 3: Check if the task is assigned to a tasker and not completed or canceled
    if (task.status === TaskStatus.CANCELLED || task.status === TaskStatus.COMPLETED)
      throw new HttpException(400, 'task is already completed or canceled');
    if (task.status !== TaskStatus.ASSIGNED) throw new HttpException(400, 'bad_request');

    // Step 4: Get the tasker who has the accepted offer
    // @ts-ignore
    const tasker = await this.taskerDao.getOneById(task.acceptedOffer.taskerId, '', false);
    if (!tasker) throw new HttpException(404, 'resource_not_found');

    // Step 5: Handle the task payment method
    if (task.paymentMethod === PaymentMethod.CASH) {
      // @ts-ignore
      const commission: number = (task.acceptedOffer.price * tasker.commissionRate).toFixed(2);
      task.commission = commission;
      tasker.notPaidTasks.push(task._id);
    }
    // TODO: Implement online payment method

    // Step 6: Update tasker's earnings and completed tasks
    // @ts-ignore
    tasker.totalEarnings += task.acceptedOffer.price;
    // @ts-ignore
    tasker.netEarnings = (tasker.netEarnings || 0) + (task.acceptedOffer.price - task.commission);
    tasker.completedTasks.push(task._id);

    // Step 7: Update task status to COMPLETED
    task.status = TaskStatus.COMPLETED;

    // Step 8: Save changes and return the updated task
    await Promise.all([task.save(), tasker.save()]);
    return task;
  };
}

export { TaskService };
