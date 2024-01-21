import { autoInjectable } from 'tsyringe';

import { CategoryDao } from '../DB/dao';
import TaskerDao from '../DB/dao/tasker.dao';
import HttpException from '../exceptions/HttpException';
import { ITasker, ITaskerService } from '../interfaces/tasker.interface';

@autoInjectable()
class TaskerService implements ITaskerService {
  constructor(private readonly categoryDao: CategoryDao, private readonly taskerDao: TaskerDao) {}
  async createTasker(userId: string, tasker: ITasker) {
    // check if service is exists in DB
    await Promise.all(
      tasker.categories.map(async service => {
        let serviceExists = await this.categoryDao.getOneById(service);
        if (!serviceExists) throw new HttpException(404, `Service ID ${service} doesn't exist in DB`);
        return service;
      })
    );

    tasker.userId = userId;
    return await this.taskerDao.create(tasker);
  }

  async getTasker(taskerId: string) {
    return await this.taskerDao.getTaskerProfile(taskerId);
  }

  async getMyProfile(userId: string) {
    return await this.taskerDao.getOne({ userId });
  }
  async getTaskers(reqQuery: any) {
    if (reqQuery.categories) {
      // check if service is exists in DB
      let isServiceExists = await this.categoryDao.getOneById(reqQuery.categories);
      if (!isServiceExists) throw new HttpException(404, `Service ID ${reqQuery.categories} doesn't exist in DB`);
    }
    let taskers = await this.taskerDao.listTaskers(reqQuery.longitude, reqQuery.latitude, reqQuery.categories, reqQuery.maxDistance);
    return taskers;
  }

  async updateTasker(userId: string, tasker: Partial<ITasker>) {
    if (tasker.categories)
      await Promise.all(
        tasker.categories.map(async service => {
          let serviceExists = await this.categoryDao.getOneById(service);
          if (!serviceExists) throw new HttpException(404, `Service ID ${service} doesn't exist in DB`);
          return service;
        })
      );

    return await this.taskerDao.updateOne({ userId }, tasker);
  }

  async deleteTasker(userId: string) {
    return await this.taskerDao.deleteOne({ userId });
  }
}

export { TaskerService };
