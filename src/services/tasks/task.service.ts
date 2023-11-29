import { autoInjectable } from 'tsyringe';

import { TaskDao } from '../../DB/dao/task.dao';
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
