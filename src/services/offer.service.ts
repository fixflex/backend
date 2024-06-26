import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { io } from '..';
import { TaskerDao } from '../DB/dao';
import { OfferDao } from '../DB/dao/offer.dao';
import { TaskDao } from '../DB/dao/task.dao';
import HttpException from '../exceptions/HttpException';
import { NotificationOptions } from '../helpers/onesignal';
import { OneSignalApiHandler } from '../helpers/onesignal';
import { IOffer, IOfferService, IUser, OfferStatus } from '../interfaces';
import { TaskStatus } from '../interfaces/task.interface';
import { IPagination } from './../interfaces/pagination.interface';
import { ITask } from './../interfaces/task.interface';
import { ITasker } from './../interfaces/tasker.interface';

@autoInjectable()
class OfferService implements IOfferService {
  constructor(
    private offerDao: OfferDao,
    private taskerDao: TaskerDao,
    private taskDao: TaskDao,
    // private transactionDao: TransactionDao,
    private oneSignalApiHandler: OneSignalApiHandler
  ) {}

  //  // 4-   Decrement product quantity, increment product sold
  //  if (order) {
  //   const bulkOption = cart.cartItems.map((item) => ({
  //       updateOne: {
  //           filter: { _id: item.product },
  //           update: {
  //               $inc: { quantity: -item.quantity, sold: item.quantity },
  //           },
  //       },
  //   }));
  //   await Product.bulkWrite(bulkOption, {});

  // TODO : use mongoose middleware to check if the tasker is paid and verified before creating an offer
  async createOffer(offer: IOffer, userId: string) {
    // 1. check if the user is a tasker & notPaidTask array is empty
    let tasker = await this.taskerDao.getOnePopulate<{ userId: IUser }>({ userId }, { path: 'userId' });
    if (!tasker) throw new HttpException(403, 'You_are_not_a_tasker');
    if (!tasker.isActive) throw new HttpException(403, 'You_are_not_active');
    // if (tasker.notPaidTasks && tasker.notPaidTasks.length > 0) throw new HttpException(403, 'You must pay the previous tasks commissions');
    // 2. check if the task is exist and status is open
    let task = await this.taskDao.getOne({ _id: offer.taskId }); // TODO: use getOneById
    if (!task) throw new HttpException(400, 'Task_not_found');
    // 2.1 check that the tasker is not the owner of the task
    if (task.userId === userId) throw new HttpException(400, 'You_cant_make_an_offer_on_your_task');
    // 2.2 check that the tasker phone is verified
    if (!tasker.userId.phoneNumVerified) throw new HttpException(400, 'You_must_verify_your_phone_number');
    if (task.status !== TaskStatus.OPEN) throw new HttpException(400, 'Task_is_not_open');
    // 3. check if the tasker already made an offer on this task, if yes return an error
    let isOfferExist = await this.offerDao.getOne({ taskId: offer.taskId, taskerId: tasker._id });
    if (isOfferExist) throw new HttpException(400, 'You_already_made_an_offer_on_this_task');
    // 4. create the offer and add the tasker id to it
    // @ts-ignore
    offer.taskerId = tasker._id;
    let newOffer = await this.offerDao.create(offer);
    // 5. update the task offers array with the new offer
    await this.taskDao.updateOneById(offer.taskId, { $push: { offers: newOffer._id } });
    let notificationOptions: NotificationOptions = {
      headings: { en: 'New Offer' },
      contents: { en: 'You have a new offer' },
      data: { task: task._id },
      external_ids: [task.userId],
    };
    // let notification =
    await this.oneSignalApiHandler.createNotification(notificationOptions);
    // console.log(notification.id);
    io.to(task.userId).emit('newOffer', JSON.stringify(newOffer, null, 2));
    // socketIO.to(taskCreatorSocketId).emit('newOffer', newOffer);
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
    let offer = await this.offerDao.getOneByIdPopulate<{ taskId: ITask; taskerId: ITasker }>(
      id,
      { path: 'taskId taskerId', select: '' },
      '',
      false
    );
    if (!offer) throw new HttpException(404, 'resource_not_found');
    // 2. check if the user is the owner of the task

    if (offer.taskId.userId.toString() !== userId.toString()) throw new HttpException(403, 'forbidden');
    // 3. check if task status is open

    if (offer.taskId.status !== TaskStatus.OPEN) throw new HttpException(400, 'Task_is_not_open');

    //  4. update the offer status to accepted
    offer.status = OfferStatus.ACCEPTED;
    await offer.save();

    // @ts-ignore
    await this.taskDao.updateOneById(offer.taskId._id, {
      status: TaskStatus.ASSIGNED,
      acceptedOffer: offer._id,
      // @ts-ignore
      taskerId: offer.taskerId._id.toString(),
      commission: offer.price * offer.taskerId.commissionRate,
    });
    // 6. send notification to the tasker that his offer is accepted

    let notificationOptions: NotificationOptions = {
      headings: { en: 'Offer Accepted' },
      contents: { en: 'Your offer has been accepted' },

      // @ts-ignore
      data: { task: offer.taskId._id.toString() },

      external_ids: [offer.taskerId.userId],
    };

    // let notification =
    await this.oneSignalApiHandler.createNotification(notificationOptions);
    // console.log(notification);

    return offer;
  }
}

export { OfferService };
