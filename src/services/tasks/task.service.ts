import { autoInjectable } from 'tsyringe';

import { TaskDao } from '../../DB/dao/task.dao';
import HttpException from '../../exceptions/HttpException';
import { ITask } from '../../interfaces';

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

  uploadTaskImages = async (_id: string, _files: any, _userId: string | undefined) => {
    // // check if the user is the owner of the task
    // const task = await this.taskDao.getOneById(id);
    // if (!task) throw new HttpException(404, 'Task not found');
    // if (task.ownerId !== userId?.toString()) throw new HttpException(403, 'You are not allowed to update this task');

    // // upload the images to cloudinary
    // let images = [];
    // if (files.imageCover) {
    //   let imageCover = await this.uploadImage(files.imageCover[0]);
    //   images.push(imageCover);
    // }
    // if (files.taskImages) {
    //   for (let image of files.taskImages) {
    //     let taskImage = await this.uploadImage(image);
    //     images.push(taskImage);
    //   }
    // }
    // // add the images to the task
    // const updatedTask = await this.taskDao.updateOneById(id, { images });
    return 'updatedTask';
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
