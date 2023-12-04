import { autoInjectable } from 'tsyringe';

import { TaskDao } from '../../DB/dao/task.dao';
import HttpException from '../../exceptions/HttpException';
import { ITask } from '../../interfaces';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../../utils/cloudinary';

@autoInjectable()
class TaskService {
  constructor(private readonly taskDao: TaskDao) {}

  getTasks = async () => {
    const tasks = await this.taskDao.getMany();
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

  uploadTaskImages = async (id: string, files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }, userId: string | undefined) => {
    // 1- check if the user is the owner of the task
    const task = await this.taskDao.getOneById(id);
    if (!task) throw new HttpException(404, 'Task not found');
    if (task.ownerId !== userId?.toString()) throw new HttpException(403, 'You are not allowed to update this task');
    // 2- upload the images to cloudinary
    // 2.1- upload the cover image to cloudinary
    const imageCover = await cloudinaryUploadImage((files as { [fieldname: string]: Express.Multer.File[] }).imageCover[0].buffer, 'task-image');
    // 2.2- upload the images to cloudinary
    const images = await Promise.all(
      (files as { [fieldname: string]: Express.Multer.File[] }).image.map(async (img: Express.Multer.File) => await cloudinaryUploadImage(img.buffer, 'task-image'))
    );
    // 3- delete the old images from cloudinary
    // 3.1- delete the old cover image from cloudinary
    if (task.imageCover.publicId) await cloudinaryDeleteImage(task.imageCover.publicId);
    if (task.images.length > 0)
      await Promise.all(
        task.images.map(async img => {
          if (img.publicId) return await cloudinaryDeleteImage(img.publicId);
          // 3.2- delete the old images from cloudinary
        })
      );
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

  deleteTask = async (id: string, userId: string | undefined) => {
    const task = await this.taskDao.getOneById(id);
    if (!task) throw new HttpException(404, 'Task not found');
    if (task.ownerId !== userId?.toString()) throw new HttpException(403, 'You are not allowed to update this task');
    const deletedTask = await this.taskDao.deleteOneById(id);
    return deletedTask;
  };
}

export { TaskService };
