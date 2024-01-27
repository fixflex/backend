import { UploadApiResponse } from 'cloudinary';
import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { TaskDao } from '../DB/dao/task.dao';
import HttpException from '../exceptions/HttpException';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../helpers/cloudinary';
import { ITask, ITaskService } from '../interfaces';

@autoInjectable()
class TaskService implements ITaskService {
  constructor(private readonly taskDao: TaskDao) {}

  getTasks = async (query: Query) => {
    const tasks = await this.taskDao.getTasks(query);
    return tasks;
  };

  getTaskById = async (id: string) => {
    const task = await this.taskDao.getOneById(id);
    return task;
  };

  createTask = async (task: ITask) => {
    const newTask = await this.taskDao.create(task);
    return newTask;
  };

  updateTask = async (id: string, payload: ITask, userId: string | undefined) => {
    // check if the user is the owner of the task
    const task = await this.taskDao.getOneById(id);

    if (!task) throw new HttpException(404, 'Task not found');
    // convert the id to string to compare it with the ownerId
    if (task.ownerId !== userId?.toString()) throw new HttpException(403, 'You are not allowed to update this task');
    const updatedTask = await this.taskDao.updateOneById(id, payload);
    return updatedTask;
  };

  uploadTaskImages = async (id: string, files: { [fieldname: string]: Express.Multer.File[] }, userId: string) => {
    // 1. Check if files are uploaded
    if (!files.imageCover && !files.image) throw new HttpException(400, 'Please upload files');

    // 2. Check if the task exists and the user is the owner of the task
    const task = await this.taskDao.getOneById(id);
    if (!task) throw new HttpException(404, 'Task not found');
    if (task.ownerId !== userId?.toString()) throw new HttpException(403, 'You are not allowed to update this task');

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
      images = await Promise.all(files.image.map(async (img: Express.Multer.File) => await cloudinaryUploadImage(img.buffer, 'task-image')));

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

  deleteTask = async (id: string, userId: string | undefined) => {
    const task = await this.taskDao.getOneById(id);
    if (!task) throw new HttpException(404, 'Task not found');
    if (task.ownerId !== userId?.toString()) throw new HttpException(403, 'You are not allowed to update this task');
    const deletedTask = await this.taskDao.deleteOneById(id);
    return deletedTask;
  };
}

export { TaskService };

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
