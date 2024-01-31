import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { OfferDao } from '../DB/dao/offer.dao';
import { TaskDao } from '../DB/dao/task.dao';
import TaskerDao from '../DB/dao/tasker.dao';
import HttpException from '../exceptions/HttpException';
import { IOffer, IOfferService, OfferStatus } from '../interfaces';
import { TaskStatus } from '../interfaces/task.interface';
import { IPagination } from './../interfaces/pagination.interface';

@autoInjectable()
class OfferService implements IOfferService {
  constructor(private offerDao: OfferDao, private taskerDao: TaskerDao, private taskDao: TaskDao) {}

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

  async getOffers(reqQuery: Query): Promise<{ offers: IOffer[]; pagination: IPagination | undefined }> {
    const { offers, pagination } = await this.offerDao.getOffers(reqQuery);
    return { offers, pagination };
  }

  async updateOffer(id: string, payload: Partial<IOffer>, userId: string) {
    // 1. check if the user is a tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'forbidden');
    // 2. check if the offer is exist
    let offer = await this.offerDao.getOneById(id);
    if (!offer) throw new HttpException(404, 'resource_not_found');
    // 3. check if the offer belongs to this tasker
    if (offer.taskerId.toString() !== tasker._id.toString()) throw new HttpException(400, 'forbidden');
    // 4. update the offer and return it
    return await this.offerDao.updateOneById(id, payload);
  }

  async deleteOffer(id: string, userId: string) {
    // 1. check if the user is a tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You_are_not_a_tasker');
    // 2. check if the offer is exist
    let offer = await this.offerDao.getOneById(id);
    if (!offer) throw new HttpException(404, 'resource_not_found');
    // 3. check if the offer belongs to this tasker
    if (offer.taskerId.toString() !== tasker._id.toString()) throw new HttpException(403, 'forbidden');
    // 5. check if the offer status is not accepted
    if (offer.status === OfferStatus.ACCEPTED) throw new HttpException(403, 'forbidden');
    // 6. delete the offer from the task offers array
    await this.taskDao.updateOneById(offer.taskId, { $pull: { offers: offer._id } });
    // 7. delete the offer
    return await this.offerDao.deleteOneById(id);
  }

  async acceptOffer(id: string, userId: string) {
    // 1. check if the user is the owner of the task
    let task = await this.taskDao.getOne({ userId }, false);
    if (!task) throw new HttpException(404, 'resource_not_found');
    // 2. check if task status is open
    if (task.status !== TaskStatus.OPEN) throw new HttpException(400, 'Task_is_not_open');
    // 3. check if the offer is exist
    let offer = await this.offerDao.getOneById(id);
    if (!offer) throw new HttpException(404, 'resource_not_found');
    // 4. check if the offer belongs to this task
    if (offer.taskId.toString() !== task._id.toString()) throw new HttpException(403, 'forbidden');
    // 5. update the offer status to accepted
    let acceptedOffer = await this.offerDao.updateOneById(id, { status: OfferStatus.ACCEPTED });
    if (!acceptedOffer) throw new HttpException(400, 'something_went_wrong');
    // 6. update the task status to assigned and add the accepted offer id to it
    await this.taskDao.updateOneById(task._id, { status: TaskStatus.ASSIGNED, acceptedOffer: acceptedOffer._id });
    // 7. TODO: send notification to the tasker that his offer is accepted
    // 8. return the accepted offer
    return acceptedOffer;
  }
}

export { OfferService };
