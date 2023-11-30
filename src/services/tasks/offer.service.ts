import { autoInjectable } from 'tsyringe';

import { OfferDao } from '../../DB/dao/offer.dao';
import { TaskDao } from '../../DB/dao/task.dao';
import TaskerDao from '../../DB/dao/tasker.dao';
import HttpException from '../../exceptions/HttpException';
import { TaskStatus } from '../../interfaces/task.interface';

@autoInjectable()
class OfferService {
  constructor(private offerDao: OfferDao, private taskerDao: TaskerDao, private taskDao: TaskDao) {}

  async createOffer(offer: any, userId: string | undefined) {
    // check if the current user is a tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You are not a tasker');
    // check if task exists
    let task = await this.taskDao.getOneById(offer.taskId);
    if (!task) throw new HttpException(400, 'Task not found');
    if (task.status !== TaskStatus.OPEN) throw new HttpException(400, 'This task is not open for offers');
    offer.taskerId = tasker._id;
    return await this.offerDao.create(offer);
  }

  async getOfferById(id: string) {
    return await this.offerDao.getOneById(id);
  }

  async getOffers() {
    return await this.offerDao.getMany();
  }

  async updateOffer(id: string, offer: any, userId: string | undefined) {
    // check if this user is a tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You are not a tasker');
    offer.taskerId = tasker._id;
    return await this.offerDao.updateOneById(id, offer);
  }

  async deleteOffer(id: string, userId: string | undefined) {
    // check if this user is a tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You are not a tasker');
    return await this.offerDao.deleteOneById(id);
  }
}

export { OfferService };
