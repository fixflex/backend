import ServiceDao from '../../DB/dao/service.dao';
import TaskerDao from '../../DB/dao/tasker.dao';
import HttpException from '../../exceptions/HttpException';
import { ITasker } from '../../interfaces/user.interface';

class TaskerService {
  async registerAsTasker(userId: string, tasker: ITasker) {
    await Promise.all(
      tasker.services.map(async service => {
        let serviceExists = await ServiceDao.getServiceById(service);
        if (!serviceExists) throw new HttpException(404, `Service ID ${service} doesn't exist in DB`);
        return service;
      })
    );

    tasker.userId = userId;
    return await TaskerDao.create(tasker);
  }

  async getTaskerProfile(userId: string) {
    return await TaskerDao.getTaskerByUserId(userId);
  }

  async getListOfTaskers(reqQuery: any) {
    console.log(reqQuery.longitude, reqQuery.latitude, reqQuery.services, reqQuery.maxDistance);
    if (reqQuery.services) {
      // check if service is exists in DB
      let isServiceExists = await ServiceDao.getServiceById(reqQuery.services);
      if (!isServiceExists) throw new HttpException(404, `Service ID ${reqQuery.services} doesn't exist in DB`);
    }
    let taskers = await TaskerDao.listTaskers(reqQuery.longitude, reqQuery.latitude, reqQuery.services, reqQuery.maxDistance);
    return taskers;
  }

  async updateMyTaskerProfile(userId: string, tasker: ITasker) {
    if (tasker.services)
      await Promise.all(
        tasker.services.map(async service => {
          let serviceExists = await ServiceDao.getServiceById(service);
          if (!serviceExists) throw new HttpException(404, `Service ID ${service} doesn't exist in DB`);
          return service;
        })
      );

    return await TaskerDao.updateTaskerByUserId(userId, tasker);
  }

  async deleteMyTaskerProfile(userId: string) {
    return await TaskerDao.deleteTaskerByUserId(userId);
  }
}

export { TaskerService };
