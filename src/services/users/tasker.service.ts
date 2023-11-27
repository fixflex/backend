import { autoInjectable } from 'tsyringe';

import ServiceDao from '../../DB/dao/service.dao';
import TaskerDao from '../../DB/dao/tasker.dao';
import HttpException from '../../exceptions/HttpException';
import { ITasker } from '../../interfaces/user.interface';

@autoInjectable()
class TaskerService {
  constructor(private readonly serviceDao: ServiceDao, private readonly taskerDao: TaskerDao) {}
  async createTasker(userId: string, tasker: ITasker) {
    // check if service is exists in DB
    await Promise.all(
      tasker.services.map(async service => {
        let serviceExists = await this.serviceDao.getOneById(service);
        if (!serviceExists) throw new HttpException(404, `Service ID ${service} doesn't exist in DB`);
        return service;
      })
    );

    tasker.userId = userId;
    return await this.taskerDao.create(tasker);
  }

  async getTaskerProfile(taskerId: string) {
    return await this.taskerDao.getOneById(taskerId);
  }

  async getListOfTaskers(reqQuery: any) {
    if (reqQuery.services) {
      // check if service is exists in DB
      let isServiceExists = await this.serviceDao.getOneById(reqQuery.services);
      if (!isServiceExists) throw new HttpException(404, `Service ID ${reqQuery.services} doesn't exist in DB`);
    }
    let taskers = await this.taskerDao.listTaskers(reqQuery.longitude, reqQuery.latitude, reqQuery.services, reqQuery.maxDistance);
    return taskers;
  }

  async updateMyTaskerProfile(userId: string, tasker: ITasker) {
    if (tasker.services)
      await Promise.all(
        tasker.services.map(async service => {
          let serviceExists = await this.serviceDao.getOneById(service);
          if (!serviceExists) throw new HttpException(404, `Service ID ${service} doesn't exist in DB`);
          return service;
        })
      );

    return await this.taskerDao.updateOneById(userId, tasker);
  }

  async deleteMyTaskerProfile(userId: string) {
    return await this.taskerDao.deleteOneById(userId);
  }
}

export { TaskerService };
