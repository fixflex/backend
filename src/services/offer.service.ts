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

  // // check if the current user is a tasker
  // let tasker = await this.taskerDao.getOne({ userId });
  // if (!tasker) throw new HttpException(400, 'You are not a tasker');
  // // check if task exists
  // let task = await this.taskDao.getOneById(offer.taskId);
  // if (!task) throw new HttpException(400, 'Task not found');
  // if (task.status !== TaskStatus.OPEN) throw new HttpException(400, 'This task is not open for offers');
  // offer.taskerId = tasker._id;
  // let createdOffer = await this.offerDao.create(offer);
  // // update the task status to assigned and add the offer id to the task offers array
  // await this.taskDao.updateOneById(offer.taskId, {
  //   $push: { offers: createdOffer._id },
  // });
  async createOffer(offer: IOffer, userId: string) {
    // 1. check if the user is a tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You_are_not_a_tasker');
    // 2. check if the task is exist and status is open
    let task = await this.taskDao.getOne({ _id: offer.taskId });
    if (!task) throw new HttpException(400, 'Task_not_found');
    if (task.status !== TaskStatus.OPEN) throw new HttpException(400, 'Task_is_not_open');
    // 3. check if the tasker already made an offer on this task, if yes return an error
    let isOfferExist = await this.offerDao.getOne({ taskId: offer.taskId, taskerId: tasker._id });
    if (isOfferExist) throw new HttpException(400, 'something_went_wrong');
    // 4. create the offer and add the tasker id to it
    offer.taskerId = tasker._id;
    let newOffer = await this.offerDao.create(offer);
    // 5. update the task offers array with the new offer
    await this.taskDao.updateOneById(offer.taskId, { $push: { offers: newOffer._id } });
    // TODO: 6. send notification to the owner of the task
    // 7. return the offer
    return newOffer;
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
