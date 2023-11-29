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

  createTask = async (task: ITask, userId: string | undefined) => {
    // check if the owner is the same as the logged in user
    if (task.ownerId != userId) throw new HttpException(403, 'You are not allowed to create a task for another user');
    const newTask = await this.taskDao.create(task);
    return newTask;
  };

  updateTask = async (id: string, task: ITask) => {
    const updatedTask = await this.taskDao.updateOneById(id, task);
    return updatedTask;
  };

  deleteTask = async (id: string) => {
    const deletedTask = await this.taskDao.deleteOneById(id);
    return deletedTask;
  };
}

export { TaskService };
