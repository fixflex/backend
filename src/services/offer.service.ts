import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { io } from '..';
import { TaskerDao } from '../DB/dao';
import { OfferDao } from '../DB/dao/offer.dao';
import { TaskDao } from '../DB/dao/task.dao';
import HttpException from '../exceptions/HttpException';
import { NotificationOptions } from '../helpers/onesignal';
import { OneSignalApiHandler } from '../helpers/onesignal';
import { IOffer, IOfferService, OfferStatus } from '../interfaces';
import { TaskStatus } from '../interfaces/task.interface';
import { IPagination } from './../interfaces/pagination.interface';

@autoInjectable()
class OfferService implements IOfferService {
  constructor(
    private offerDao: OfferDao,
    private taskerDao: TaskerDao,
    private taskDao: TaskDao,
    private oneSignalApiHandler: OneSignalApiHandler
  ) {}

  async createOffer(offer: IOffer, userId: string) {
    // 1. check if the user is a tasker & notPaidTask array is empty
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(403, 'You_are_not_a_tasker');
    if (tasker.notPaidTasks && tasker.notPaidTasks.length > 0) throw new HttpException(403, 'You_have_not_paid_tasks');
    // 2. check if the task is exist and status is open
    let task = await this.taskDao.getOne({ _id: offer.taskId });
    if (!task) throw new HttpException(400, 'Task_not_found');
    if (task.status !== TaskStatus.OPEN) throw new HttpException(400, 'Task_is_not_open');
    // 3. check if the tasker already made an offer on this task, if yes return an error
    // let isOfferExist = await this.offerDao.getOne({ taskId: offer.taskId, taskerId: tasker._id });
    // if (isOfferExist) throw new HttpException(400, 'You_already_made_an_offer_on_this_task');
    // 4. create the offer and add the tasker id to it
    offer.taskerId = tasker._id;
    let newOffer = await this.offerDao.create(offer);
    // 5. update the task offers array with the new offer
    await this.taskDao.updateOneById(offer.taskId, { $push: { offers: newOffer._id } });
    // TODO: 6. send notification to the owner of the task using 1- socket.io 2- firebase cloud messaging
    let notificationOptions: NotificationOptions = {
      headings: { en: 'New Offer' },
      contents: { en: 'You have a new offer' },
      data: { task: task._id },
      external_ids: [task.userId],
    };
    this.oneSignalApiHandler.createNotification(notificationOptions);
    // console.log(notification);
    io.to(task.userId).emit('newOffer', newOffer);
    // socketIO.to(taskCreatorSocketId).emit('newOffer', newOffer);
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
    // 4. check if the offer status is accepted
    // 4.1 if yes, return an error
    if (offer.status === OfferStatus.ACCEPTED) throw new HttpException(403, 'forbidden');
    // TODO: if accepted, change the offer status to canceled, send notification to the owner of the task that the offer he accepted is canceled and change the task status to open

    // 6. delete the offer from the task offers array
    await this.taskDao.updateOneById(offer.taskId, { $pull: { offers: offer._id } });
    // 7. delete the offer
    return await this.offerDao.deleteOneById(id);
  }

  async acceptOffer(id: string, userId: string) {
    // 1. get the offer by id
    let offer = await this.offerDao.getOneByIdPopulate(id, { path: 'taskId taskerId', select: '' }, '', false);
    if (!offer) throw new HttpException(404, 'resource_not_found');
    // 2. check if the user is the owner of the task
    // @ts-ignore
    if (offer.taskId.userId.toString() !== userId.toString()) throw new HttpException(403, 'forbidden');
    // 3. check if task status is open
    // @ts-ignore
    if (offer.taskId.status !== TaskStatus.OPEN) throw new HttpException(400, 'Task_is_not_open');
    //  4. update the offer status to accepted
    offer.status = OfferStatus.ACCEPTED;
    await offer.save();
    // 5. update the task status to assigned and add the accepted offer id to it
    // @ts-ignore
    let updatedTask = await this.taskDao.updateOneById(offer.taskId._id, {
      status: TaskStatus.ASSIGNED,
      acceptedOffer: offer._id,
      // @ts-ignore
      commission: offer.price * offer.taskerId.commissionRate,
    });

    // in mongoDB if the field doesn't exist it will be created, to make it update only if the field exists, we need to use $set but it's not working with the updateOneById method so we need to use the updateOne method

    // 6. TODO: send notification to the tasker that his offer is accepted
    // 7. return the accepted offer
    return offer;
  }
}
export { OfferService };
