import { autoInjectable } from 'tsyringe';

import { OfferDao } from '../DB/dao/offer.dao';
import { TaskDao } from '../DB/dao/task.dao';
import TaskerDao from '../DB/dao/tasker.dao';
import HttpException from '../exceptions/HttpException';
import { IOffer, IOfferService } from '../interfaces';
import { TaskStatus } from '../interfaces/task.interface';

@autoInjectable()
class OfferService implements IOfferService {
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

  async getOffers(taskId: any) {
    if (taskId) return await this.offerDao.getMany({ taskId });
    return await this.offerDao.getMany();
  }

  async updateOffer(id: string, payload: Partial<IOffer>, userId: string | undefined) {
    // check if this offer belongs to this tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You are not a tasker');
    let offer = await this.offerDao.getOneById(id);
    if (!offer) throw new HttpException(404, 'Offer not found');
    if (offer.taskerId.toString() !== tasker._id.toString()) throw new HttpException(400, 'This offer is not yours');
    return await this.offerDao.updateOneById(id, payload);
  }

  async deleteOffer(id: string, userId: string | undefined) {
    //check if this offer belongs to this tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You are not a tasker');
    let offer = await this.offerDao.getOneById(id);
    if (!offer) throw new HttpException(404, 'Offer not found');
    if (offer.taskerId.toString() !== tasker._id.toString()) throw new HttpException(400, 'This offer is not yours');
    return await this.offerDao.deleteOneById(id);
  }
}

export { OfferService };
