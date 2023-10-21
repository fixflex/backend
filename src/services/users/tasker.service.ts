// import bcrypt from 'bcrypt';
// import fs from 'fs';
import { autoInjectable } from 'tsyringe';

import ServiceDao from '../../DB/dao/service.dao';
import TaskerDao from '../../DB/dao/tasker.dao';
import HttpException from '../../exceptions/HttpException';
// import { IPagination } from '../../interfaces/respons.interface';
import { ITasker } from '../../interfaces/user.interface';

// import APIFeatures from '../../utils/apiFeatures';
// import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../../utils/cloudinary';

@autoInjectable()
class TaskerService {
  constructor(private taskerDao: TaskerDao) {}

  async registerAsTasker(userId: string, tasker: ITasker) {
    //  check if all service in services array exists in services collection in DB and if not throw an error with the service name that doesn't exist in DB
    await Promise.all(
      tasker.services.map(async service => {
        let serviceExists = await ServiceDao.getServiceById(service);
        if (!serviceExists) throw new HttpException(404, `Service ID ${service} doesn't exist in DB`);
        return service;
      })
    );

    tasker.userId = userId;
    return await this.taskerDao.create(tasker);
  }
}

export { TaskerService };
