import axios from 'axios';
import crypto from 'crypto';
import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { io } from '..';
import { TaskerDao } from '../DB/dao';
import { OfferDao } from '../DB/dao/offer.dao';
import { TaskDao } from '../DB/dao/task.dao';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { NotificationOptions } from '../helpers/onesignal';
import { OneSignalApiHandler } from '../helpers/onesignal';
import { IOffer, IOfferService, OfferStatus } from '../interfaces';
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
    // this.createHeader('GET', 'https://accept.paymob.com/api/auth/tokens', env.PAYMOB_PUBLIC_KEY, env.PAYMOB_INTEGRATION_ID, {});
    let signature = this.createHeader('GET', '/api/v1/balance/', env.PAYMOB_SECRET_KEY, env.PAYMOB_PUBLIC_KEY, {});
    console.log('signature ======================>>', signature);
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

  async checkoutOffer(id: string, userId: string, payload: any) {
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

    // 5. check the PaymentMethod of the offer
    // 5.2 if the payment method is card then call paymob api to create a payment link and send it to the task owner to pay the task price then update the task status to assigned and add the accepted offer id to it
    try {
      if (payload.paymentMethod === 'card') {
        // call paymob api to create a payment link and send it to the task owner to pay the task price
        let paymobToken = await this.getPaymobToken();
        console.log('paymobToken ======================>>');
        console.log(paymobToken);
        let order = await this.createOrder(paymobToken, offer);
        console.log('order ======================>>');
        console.log(order);
        let paymentToken = await this.getPaymentToken(paymobToken, order.id);
        console.log('paymentToken ======================>>');
        console.log(paymentToken);
        // https://accept.paymob.com/api/acceptance/iframes/826805?payment_token={payment_key_obtained_previously}
        let iframe = `https://accept.paymob.com/api/acceptance/iframes/826805?payment_token=${paymentToken.token}`;
        let iframe2 = `https://accept.paymob.com/api/acceptance/iframes/826806?payment_token=${paymentToken.token}`;
        console.log('iframes');
        console.log('iframe1', iframe);
        console.log('iframe2', iframe2);
        // send the payment link to the task owner
        // update the task status to assigned and add the accepted offer id to it
      }
      // 5.3 if the payment method is wallet then call paymob api to create a payment link and send it to the task owner to pay the task price then update the task status to assigned and add the accepted offer id to it
      else if (payload.paymentMethod === 'wallet') {
        //   // 1. get paymobToken
        //   let paymobToken = await this.getPaymobToken();
        //   // 2  create order using paymob api and get the order id
        //   let order = await this.createOrder(paymobToken, offer);
        //   // 3. create payment token using paymob api and get the payment token
        //   let paymentToken = await this.getPaymentToken(paymobToken, order.id);
        //   // 4. send the payment link to the task owner
        //   // 5. update the task status to assigned and add the accepted offer id to it

        let paymobToken = await this.getPaymobToken();
        console.log('paymobToken ======================>>');
        console.log(paymobToken);
        let order = await this.createOrder(paymobToken, offer);
        console.log('order ======================>>');
        console.log(order);

        let paymentToken = await this.getPaymentToken(paymobToken, order.id);
        console.log('paymentToken ======================>>');
        console.log(paymentToken);
        // https://accept.paymob.com/api/acceptance/iframes/826805?payment_token={payment_key_obtained_previously}
        let iframe = `https://accept.paymob.com/api/acceptance/iframes/826805?payment_token=${paymentToken.token}`;
        let iframe2 = `https://accept.paymob.com/api/acceptance/iframes/826806?payment_token=${paymentToken.token}`;
        // let iframeForWallet = `https://accept.paymob.com/api/acceptance/iframes/01010101010?payment_token=${paymentToken.token}`;
        // let iframeForWallet = `https://accept.paymobsolutions.com/api/acceptance/iframes/01066032817?payment_token=${paymentToken.token}`;
        console.log('iframes');
        console.log('iframe1 ==========>>> ', iframe);
        console.log('iframe2 ============>>> ', iframe2);
        // console.log('iframeForWallet ========>>> ', iframeForWallet);

        let paymentTokenWallet = await this.getPaymentTokenWallet(paymentToken.token, order.id);
        console.log('paymentTokenWallet ======================>>');
        console.log(paymentTokenWallet.redirect_url);
      }
      // 5. update the task status to assigned and add the accepted offer id to it

      return 'offer';
    } catch (error: any) {
      console.log('error ======================>>');
      console.log(error);
    }
  }

  async webhookCheckout(req: any) {
    // paymob api will send a webhook to this endpoint after the payment is done
    // 1. get the payment id from the request body
    // 2. get the payment details from paymob api
    // 3. get the order id from the payment details
    // 4. update the order status to paid

    console.log('webhook received');
    console.log('req.body ==========================>>', req.body);
    console.log('req.query ==========================>>', req.query);
    console.log('req.params ==========================>>', req.params);
    // console.log('req.headers ==========================>>', req.headers);

    return 'webhook received successfully';
  }

  // private async sendNotification() {
  //   // send notification to the owner of the task using 1- socket.io 2- firebase cloud messaging
  // }

  private async getPaymobToken() {
    // get the paymob token using axios
    let paymobToken = await axios.post('https://accept.paymob.com/api/auth/tokens', {
      api_key: env.PAYMOB_API_KEY,
    });

    return paymobToken.data.token;
  }

  private async createOrder(paymobToken: string, offer: any) {
    // create an order using paymob api
    let order = {
      auth_token: paymobToken,
      delivery_needed: 'false',
      amount_cents: offer.price * 100,
      currency: 'EGP',
      merchant_order_id: Math.floor(Math.random() * 1000).toString() + offer._id, // TODO: fix this to be unique
      items: [
        {
          name: 'task',
          amount_cents: offer.price * 100,
          description: 'task',
          quantity: '1',
        },
      ],
      notify_user_with_email: true,
    };
    let orderResponse = await axios.post('https://accept.paymob.com/api/ecommerce/orders', order);
    return orderResponse.data;
  }

  private async getPaymentToken(paymobToken: string, orderId: string) {
    let paymentToken = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
      auth_token: paymobToken,
      amount_cents: 96000,
      currency: 'EGP',
      // concatenate the orderId with rundom number to make it unique
      order_id: orderId,
      billing_data: {
        apartment: '803',
        email: 'ahmed4321mustafa5@gmail.com',
        floor: '42',
        first_name: 'Mohamed',
        street: 'Ethan Land',
        building: '8028',
        phone_number: '+201111111111',
        shipping_method: 'PKG',
        postal_code: '01898',
        city: 'Jaskolskiburgh',
        country: 'CR',
        last_name: 'Ali',
        state: 'Utah',
      },
      // integration_id: env.PAYMOB_INTEGRATION_ID,
      integration_id: env.PAYMOB_INTEGRATION_ID_WALLET,
      lock_order_when_paid: 'false', // if true, the order will be locked and can't be paid again
    });

    return paymentToken.data;
  }

  private async getPaymentTokenWallet(paymentToken: string, _orderId: string) {
    try {
      // console.log('paymentToken ======================>>', paymentToken);
      let response = await axios.post(`https://accept.paymob.com/api/acceptance/payments/pay`, {
        source: {
          identifier: '01010101010',
          subtype: 'WALLET',
        },
        payment_token: paymentToken,
      });
      // console.log(response.data.redirect_url);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  // this.createHeader('GET', '/api/v1/balance/',env.PAYMOB_SECRET_KEY , env.PAYMOB_PUBLIC_KEY, env.PAYMOB_INTEGRATION_ID, {});

  createHeader(requestMethod: any, url: any, secretKey: any, publicKey: any, payload: any) {
    // const TIMESTAMP_FMT = "yyyyMMddTHHmm";
    const timestamp = new Date().toISOString().slice(0, -5).replace(/[-:]/g, '');
    const nonce = crypto.randomBytes(16).toString('hex');
    const signatureString = requestMethod + url + publicKey + timestamp + (payload['service_id'] || '') + nonce;
    // const signatureString = requestMethod + url + publicKey + timestamp + nonce;
    const hmacSignature = crypto.createHmac('sha256', secretKey).update(signatureString).digest('hex');
    const header = `${publicKey}.${timestamp}.${hmacSignature}.${nonce}`;
    return Buffer.from(header).toString('base64');
  }
}

export { OfferService };
