// import bcrypt from 'bcrypt';
// import fs from 'fs';
import { autoInjectable } from 'tsyringe';

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
    let isUserExists = await this.taskerDao.getUserById(userId);
    if (!isUserExists) throw new HttpException(404, 'No user found');

    return await this.taskerDao.update(userId, tasker);
  }
}

export { TaskerService };
