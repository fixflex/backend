import crypto from 'crypto';
import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { io } from '..';
import { TaskerDao } from '../DB/dao';
import { OfferDao } from '../DB/dao/offer.dao';
import { TaskDao } from '../DB/dao/task.dao';
import { TransactionDao } from '../DB/dao/transaction.dao';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { Request } from '../helpers';
import { NotificationOptions } from '../helpers/onesignal';
import { OneSignalApiHandler } from '../helpers/onesignal';
import { IOffer, IOfferService, IUser, OfferStatus } from '../interfaces';
import { TaskStatus } from '../interfaces/task.interface';
import { ITransaction, TransactionType } from '../interfaces/transaction.interface';
import { IPagination } from './../interfaces/pagination.interface';
import { ITask } from './../interfaces/task.interface';
import { ITasker } from './../interfaces/tasker.interface';
import { PaymobService } from './paymob.service';

@autoInjectable()
class OfferService implements IOfferService {
  constructor(
    private offerDao: OfferDao,
    private taskerDao: TaskerDao,
    private taskDao: TaskDao,
    private transactionDao: TransactionDao,
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
    let isOfferExist = await this.offerDao.getOne({ taskId: offer.taskId, taskerId: tasker._id });
    if (isOfferExist) throw new HttpException(400, 'You_already_made_an_offer_on_this_task');
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

    await this.taskDao.updateOneById(offer.taskId._id, {
      status: TaskStatus.ASSIGNED,
      acceptedOffer: offer._id,

      commission: offer.price * offer.taskerId.commissionRate,
    });
    // 6. send notification to the tasker that his offer is accepted

    let notificationOptions: NotificationOptions = {
      headings: { en: 'Offer Accepted' },
      contents: { en: 'Your offer has been accepted' },

      data: { task: offer.taskId._id.toString() },

      external_ids: [offer.taskerId.userId],
    };

    // console.log(offer.taskerId.userId, offer.taskId._id.toString());
    // let notification =
    await this.oneSignalApiHandler.createNotification(notificationOptions);
    // console.log(notification);
    // in mongoDB if the field doesn't exist it will be created, to make it update only if the field exists, we need to use $set but it's not working with the updateOneById method so we need to use the updateOne method

    // 6. TODO: send notification to the tasker that his offer is accepted
    // 7. return the accepted offer
    return offer;
  }

  async checkoutOffer(id: string, user: IUser, payload: any) {
    // 1. get the offer by id
    let offer = await this.offerDao.getOneByIdPopulate<{ taskId: ITask; taskerId: ITasker }>(
      id,
      { path: 'taskId taskerId', select: '' },
      '',
      false
    );
    if (!offer) throw new HttpException(404, 'resource_not_found');
    // 2. check if the user is the owner of the task
    if (offer.taskId.userId.toString() !== user._id.toString()) throw new HttpException(403, 'forbidden');
    // 3. check if task status is open
    if (offer.taskId.status !== TaskStatus.OPEN) throw new HttpException(400, 'Task_is_not_open');
    // 5. check the PaymentMethod of the offer
    // 5.2 if the payment method is card then call paymob api to create a payment link and send it to the task owner to pay the task price then update the task status to assigned and add the accepted offer id to it
    let orderData = {
      TransactionType: TransactionType.ONLINE_TASK_PAYMENT,
      taskerId: offer.taskerId,
    };
    let paymentLink;
    if (payload.paymentMethod === 'card') {
      let paymobService = new PaymobService();
      paymentLink = await paymobService.initiateCardPayment(offer, user, orderData);
      console.log('paymentLink ======================>>', paymentLink);
    } else if (payload.paymentMethod === 'wallet') {
      if (!payload.phoneNumber) throw new HttpException(400, 'phone_number_is_required'); // TODO: validate the phone number
      let paymobService = new PaymobService();
      paymentLink = await paymobService.initiateWalletPayment(offer, user, orderData, payload.phoneNumber);
      console.log('walletPaymentLink ======================>>', paymentLink.redirect_url);
    }
    return paymentLink;
  }
  catch(error: any) {
    console.log('error ======================>>');
    console.log(error);
  }

  async webhookCheckout(req: Request) {
    if (req.body.type === 'TRANSACTION') {
      let obj = req.body.obj;

      let amount_cents = obj.amount_cents;
      let created_at = obj.created_at;
      let currency = obj.currency;
      let error_occured = obj.error_occured;
      let has_parent_transaction = obj.has_parent_transaction;
      let objId = obj.id;
      let integration_id = obj.integration_id;
      let is_3d_secure = obj.is_3d_secure;
      let is_auth = obj.is_auth;
      let is_capture = obj.is_capture;
      let is_refunded = obj.is_refunded;
      let is_standalone_payment = obj.is_standalone_payment;
      let is_voided = obj.is_voided;
      let order_id = obj.order.id;
      let owner = obj.owner;
      let pending = obj.pending;
      let source_data_pan = obj.source_data.pan;
      let source_data_sub_type = obj.source_data.sub_type;
      let source_data_type = obj.source_data.type;
      let success = obj.success;

      let concatenedString = `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${objId}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${order_id}${owner}${pending}${source_data_pan}${source_data_sub_type}${source_data_type}${success}`;
      let hmac = env.PAYMOB_HMAC_SECRET;
      let hash = crypto.createHmac('sha512', hmac).update(concatenedString).digest('hex');

      if (hash !== req.query.hmac) {
        return '';
      }

      let transaction: ITransaction = {
        transactionId: objId,
        amount: amount_cents,
        transactionType: TransactionType.ONLINE_TASK_PAYMENT,
        wallet: {
          phoneNumber: source_data_pan,
        },
        pinding: pending,
        success,
        orderId: order_id,
        taskId: obj.order.merchant_order_id,
      };

      let newTransaction = await this.transactionDao.create(transaction);
      console.log('newTransaction ======================>>', newTransaction);
      if (obj.success) {
        // update the task paid field to true and the task payment method to card
        await this.taskDao.updateOneById(order_id, { paid: true, paymentMethod: 'CARD' });
      }

      return 'webhook received successfully';
    }
  }
}

export { OfferService };
