import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { CategoryDao, CouponDao, TaskDao } from '../DB/dao';
import { TaskerDao } from '../DB/dao';
import HttpException from '../exceptions/HttpException';
import { IPagination } from '../interfaces';
import { ITasker, ITaskerService } from '../interfaces/tasker.interface';

@autoInjectable()
class TaskerService implements ITaskerService {
  constructor(
    private readonly categoryDao: CategoryDao,
    private readonly taskerDao: TaskerDao,
    private readonly couponeDao: CouponDao,
    private readonly taskDao: TaskDao
  ) {}
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

  async applyCoupon(userId: string, couponCode: string) {
    // step 1: check user is tasker
    let tasker = await this.taskerDao.getOne({ userId }, false);
    if (!tasker) throw new HttpException(404, 'tasker_not_found');
    // step 2: check coupon is exists & valid
    let coupon = await this.couponeDao.getOne({ code: couponCode, expirationDate: { $gte: new Date() }, remainingUses: { $gt: 0 } }, false);
    if (!coupon) throw new HttpException(404, 'coupon_not_found');
    // step 3: apply coupon to tasker
    tasker.notPaidTasks.forEach(async taskId => {
      let task = await this.taskDao.getOneById(taskId, '', false);
      if (task) {
        task.commissionAfterDescount = task.commission - (task.commission * coupon!.value) / 100;
        if (task.commissionAfterDescount <= 0) {
          // remove task from notPaidTasks
          tasker!.notPaidTasks = tasker!.notPaidTasks.filter(t => t != taskId);
          await Promise.all([task.save(), tasker!.save()]);
        } else await task.save();
      }
    });
    coupon.remainingUses--;
    await coupon.save();
    return true;
  }
}

export { TaskerService };
