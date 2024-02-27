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
import { IOffer, IOfferService, OfferStatus } from '../interfaces';
import { TaskStatus } from '../interfaces/task.interface';
import { ITransaction, PaymentMethod, TransactionType } from '../interfaces/transaction.interface';
import { IPagination } from './../interfaces/pagination.interface';
import { ITask } from './../interfaces/task.interface';
import { ITasker } from './../interfaces/tasker.interface';

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
    // 2.1 check that the tasker is not the owner of the task
    if (task.userId === userId) throw new HttpException(400, 'You_cant_make_an_offer_on_your_task');
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

    // let notification =
    await this.oneSignalApiHandler.createNotification(notificationOptions);
    // console.log(notification);
    // in mongoDB if the field doesn't exist it will be created, to make it update only if the field exists, we need to use $set but it's not working with the updateOneById method so we need to use the updateOne method

    // 6. TODO: send notification to the tasker that his offer is accepted
    // 7. return the accepted offer
    return offer;
  }

  async webhookCheckout(req: Request) {
    try {
      if (req.body.type === 'TRANSACTION') {
        let obj = req.body.obj;

        console.log('req.body ======================>>', req.body);
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

        console.log('amount_cents ======================>>', amount_cents);
        console.log('created_at ======================>>', created_at);
        console.log('currency ======================>>', currency);
        console.log('error_occured ======================>>', error_occured);
        console.log('has_parent_transaction ======================>>', has_parent_transaction);
        console.log('objId ======================>>', objId);
        console.log('integration_id ======================>>', integration_id);
        console.log('is_3d_secure ======================>>', is_3d_secure);
        console.log('is_auth ======================>>', is_auth);
        console.log('is_capture ======================>>', is_capture);
        console.log('is_refunded ======================>>', is_refunded);
        console.log('is_standalone_payment ======================>>', is_standalone_payment);
        console.log('is_voided ======================>>', is_voided);
        console.log('order_id ======================>>', order_id);
        console.log('owner ======================>>', owner);
        console.log('pending ======================>>', pending);
        console.log('source_data_pan ======================>>', source_data_pan);
        console.log('source_data_sub_type ======================>>', source_data_sub_type);
        console.log('source_data_type ======================>>', source_data_type);
        console.log('success ======================>>', success);

        let concatenedString = `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${objId}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${order_id}${owner}${pending}${source_data_pan}${source_data_sub_type}${source_data_type}${success}`;
        console.log('concatenedString ======================>>', { concatenedString });
        let hmac = env.PAYMOB_HMAC_SECRET;
        let hash = crypto.createHmac('sha512', hmac).update(concatenedString).digest('hex');

        if (hash !== req.query.hmac) {
          console.log('hash !== req.query.hmac');
          console.log('hash ======================>>', hash);
          console.log('req.query.hmac ======================>>', req.query.hmac);
          throw new HttpException(400, 'hash !== req.query.hmac');
        }

        // 1. check if the transaction is voided or refunded
        // if (is_voided || is_refunded) {
        //   let transaction = {

        //   }

        //   return 'webhook received successfully';
        // }

        let transaction: ITransaction = {
          transactionId: objId,
          amount: amount_cents / 100, // convert cents to EGP
          transactionType: is_voided
            ? TransactionType.VOID_TRANSACTION
            : is_refunded
            ? TransactionType.REFUND_TRANSACTION
            : TransactionType.ONLINE_TASK_PAYMENT,
          pinding: pending,
          success,
          orderId: order_id,
          taskId: obj.order.merchant_order_id,
        };

        let newTransaction = await this.transactionDao.create(transaction);
        console.log('newTransaction ======================>>', newTransaction);
        if (obj.success) {
          // let taskId = obj.order.merchant_order_id.slice(3); //  TODO: remove this line
          let taskId = obj.order.merchant_order_id;
          // let updatedTask =
          await this.taskDao.updateOneById(taskId, {
            paid: true,
            paymentMethod: PaymentMethod.ONLINE_PAYMENT,
          });
          // console.log('updatedTask ======================>>', updatedTask);
        }

        return 'webhook received successfully';
      }
    } catch (error: any) {
      console.log('error ======================>>');
      console.log(error);
    }
  }
}

export { OfferService };
