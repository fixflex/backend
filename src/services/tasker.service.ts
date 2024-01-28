import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { CategoryDao } from '../DB/dao';
import TaskerDao from '../DB/dao/tasker.dao';
import HttpException from '../exceptions/HttpException';
import { IPagination } from '../interfaces';
import { ITasker, ITaskerService } from '../interfaces/tasker.interface';

@autoInjectable()
class TaskerService implements ITaskerService {
  constructor(private readonly categoryDao: CategoryDao, private readonly taskerDao: TaskerDao) {}
  async createTasker(userId: string, tasker: ITasker) {
    // check if service is exists in DB
    await Promise.all(
      tasker.categories.map(async service => {
        let serviceExists = await this.categoryDao.getOneById(service);
        if (!serviceExists) throw new HttpException(404, 'category_not_found');
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

  async getTaskers(reqQuery: Query): Promise<{ taskers: ITasker[]; pagination: IPagination | undefined }> {
    const { taskers, pagination } = await this.taskerDao.getTaskers(reqQuery);
    return { pagination, taskers };
  }

  async updateTasker(userId: string, tasker: Partial<ITasker>) {
    if (tasker.categories)
      await Promise.all(
        tasker.categories.map(async service => {
          let serviceExists = await this.categoryDao.getOneById(service);
          if (!serviceExists) throw new HttpException(404, 'category_not_found');
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
