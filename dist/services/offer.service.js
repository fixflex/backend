"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferService = void 0;
const axios_1 = __importDefault(require("axios"));
const tsyringe_1 = require("tsyringe");
const __1 = require("..");
const dao_1 = require("../DB/dao");
const offer_dao_1 = require("../DB/dao/offer.dao");
const task_dao_1 = require("../DB/dao/task.dao");
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const onesignal_1 = require("../helpers/onesignal");
const interfaces_1 = require("../interfaces");
const task_interface_1 = require("../interfaces/task.interface");
let OfferService = class OfferService {
    constructor(offerDao, taskerDao, taskDao, oneSignalApiHandler) {
        this.offerDao = offerDao;
        this.taskerDao = taskerDao;
        this.taskDao = taskDao;
        this.oneSignalApiHandler = oneSignalApiHandler;
    }
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
    async createOffer(offer, userId) {
        // 1. check if the user is a tasker & notPaidTask array is empty
        let tasker = await this.taskerDao.getOne({ userId });
        if (!tasker)
            throw new HttpException_1.default(403, 'You_are_not_a_tasker');
        if (tasker.notPaidTasks && tasker.notPaidTasks.length > 0)
            throw new HttpException_1.default(403, 'You_have_not_paid_tasks');
        // 2. check if the task is exist and status is open
        let task = await this.taskDao.getOne({ _id: offer.taskId });
        if (!task)
            throw new HttpException_1.default(400, 'Task_not_found');
        if (task.status !== task_interface_1.TaskStatus.OPEN)
            throw new HttpException_1.default(400, 'Task_is_not_open');
        // 3. check if the tasker already made an offer on this task, if yes return an error
        let isOfferExist = await this.offerDao.getOne({ taskId: offer.taskId, taskerId: tasker._id });
        if (isOfferExist)
            throw new HttpException_1.default(400, 'You_already_made_an_offer_on_this_task');
        // 4. create the offer and add the tasker id to it
        offer.taskerId = tasker._id;
        let newOffer = await this.offerDao.create(offer);
        // 5. update the task offers array with the new offer
        await this.taskDao.updateOneById(offer.taskId, { $push: { offers: newOffer._id } });
        // TODO: 6. send notification to the owner of the task using 1- socket.io 2- firebase cloud messaging
        let notificationOptions = {
            headings: { en: 'New Offer' },
            contents: { en: 'You have a new offer' },
            data: { task: task._id },
            external_ids: [task.userId],
        };
        this.oneSignalApiHandler.createNotification(notificationOptions);
        // console.log(notification);
        __1.io.to(task.userId).emit('newOffer', newOffer);
        // socketIO.to(taskCreatorSocketId).emit('newOffer', newOffer);
        // 7. return the offer
        return newOffer;
    }
    async getOfferById(id) {
        return await this.offerDao.getOneById(id);
    }
    async getOffers(reqQuery) {
        const { offers, pagination } = await this.offerDao.getOffers(reqQuery);
        return { offers, pagination };
    }
    async updateOffer(id, payload, userId) {
        // 1. check if the user is a tasker
        let tasker = await this.taskerDao.getOne({ userId });
        if (!tasker)
            throw new HttpException_1.default(400, 'forbidden');
        // 2. check if the offer is exist
        let offer = await this.offerDao.getOneById(id);
        if (!offer)
            throw new HttpException_1.default(404, 'resource_not_found');
        // 3. check if the offer belongs to this tasker
        if (offer.taskerId.toString() !== tasker._id.toString())
            throw new HttpException_1.default(400, 'forbidden');
        // 4. update the offer and return it
        return await this.offerDao.updateOneById(id, payload);
    }
    async deleteOffer(id, userId) {
        // 1. check if the user is a tasker
        let tasker = await this.taskerDao.getOne({ userId });
        if (!tasker)
            throw new HttpException_1.default(400, 'You_are_not_a_tasker');
        // 2. check if the offer is exist
        let offer = await this.offerDao.getOneById(id);
        if (!offer)
            throw new HttpException_1.default(404, 'resource_not_found');
        // 3. check if the offer belongs to this tasker
        if (offer.taskerId.toString() !== tasker._id.toString())
            throw new HttpException_1.default(403, 'forbidden');
        // 4. check if the offer status is accepted
        // 4.1 if yes, return an error
        if (offer.status === interfaces_1.OfferStatus.ACCEPTED)
            throw new HttpException_1.default(403, 'forbidden');
        // TODO: if accepted, change the offer status to canceled, send notification to the owner of the task that the offer he accepted is canceled and change the task status to open
        // 6. delete the offer from the task offers array
        await this.taskDao.updateOneById(offer.taskId, { $pull: { offers: offer._id } });
        // 7. delete the offer
        return await this.offerDao.deleteOneById(id);
    }
    async acceptOffer(id, userId) {
        // 1. get the offer by id
        let offer = await this.offerDao.getOneByIdPopulate(id, { path: 'taskId taskerId', select: '' }, '', false);
        if (!offer)
            throw new HttpException_1.default(404, 'resource_not_found');
        // 2. check if the user is the owner of the task
        if (offer.taskId.userId.toString() !== userId.toString())
            throw new HttpException_1.default(403, 'forbidden');
        // 3. check if task status is open
        if (offer.taskId.status !== task_interface_1.TaskStatus.OPEN)
            throw new HttpException_1.default(400, 'Task_is_not_open');
        //  4. update the offer status to accepted
        offer.status = interfaces_1.OfferStatus.ACCEPTED;
        await offer.save();
        await this.taskDao.updateOneById(offer.taskId._id, {
            status: task_interface_1.TaskStatus.ASSIGNED,
            acceptedOffer: offer._id,
            commission: offer.price * offer.taskerId.commissionRate,
        });
        // 6. send notification to the tasker that his offer is accepted
        let notificationOptions = {
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
    async checkoutOffer(id, userId, payload) {
        try {
            // 1. get the offer by id
            let offer = await this.offerDao.getOneByIdPopulate(id, { path: 'taskId taskerId', select: '' }, '', false);
            if (!offer)
                throw new HttpException_1.default(404, 'resource_not_found');
            // 2. check if the user is the owner of the task
            if (offer.taskId.userId.toString() !== userId.toString())
                throw new HttpException_1.default(403, 'forbidden');
            // 3. check if task status is open
            if (offer.taskId.status !== task_interface_1.TaskStatus.OPEN)
                throw new HttpException_1.default(400, 'Task_is_not_open');
            // 5. check the PaymentMethod of the offer
            // 5.2 if the payment method is card then call paymob api to create a payment link and send it to the task owner to pay the task price then update the task status to assigned and add the accepted offer id to it
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
                // call paymob api to create a payment link and send it to the task owner to pay the task price
                // update the task status to assigned and add the accepted offer id to it
            }
            // 5. update the task status to assigned and add the accepted offer id to it
            return 'offer';
        }
        catch (error) {
            console.log('error ======================>>');
            console.log(error.response.data);
        }
    }
    async webhookCheckout(req) {
        // paymob api will send a webhook to this endpoint after the payment is done
        // 1. get the payment id from the request body
        // 2. get the payment details from paymob api
        // 3. get the order id from the payment details
        // 4. update the order status to paid
        console.log('webhook received');
        console.log('req.body ==========================');
        console.log(req.body);
        console.log('req.query ==========================');
        console.log(req.query);
        console.log('req.params ==========================');
        console.log(req.params);
        console.log('req.headers ==========================');
        // console.log(req.headers);
        return 'received';
    }
    // private async sendNotification() {
    //   // send notification to the owner of the task using 1- socket.io 2- firebase cloud messaging
    // }
    async getPaymobToken() {
        // get the paymob token using axios
        let paymobToken = await axios_1.default.post('https://accept.paymob.com/api/auth/tokens', {
            api_key: validateEnv_1.default.PAYMOB_API_KEY,
        });
        return paymobToken.data.token;
    }
    async createOrder(paymobToken, offer) {
        // create an order using paymob api
        let order = {
            auth_token: paymobToken,
            delivery_needed: 'false',
            amount_cents: offer.price * 100,
            currency: 'EGP',
            merchant_order_id: Math.floor(Math.random() * 1000).toString() + offer._id,
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
        let orderResponse = await axios_1.default.post('https://accept.paymob.com/api/ecommerce/orders', order);
        return orderResponse.data;
    }
    async getPaymentToken(paymobToken, orderId) {
        let paymentToken = await axios_1.default.post('https://accept.paymob.com/api/acceptance/payment_keys', {
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
            integration_id: validateEnv_1.default.PAYMOB_INTEGRATION_ID,
            lock_order_when_paid: 'false', // if true, the order will be locked and can't be paid again
        });
        return paymentToken.data;
    }
};
exports.OfferService = OfferService;
exports.OfferService = OfferService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [offer_dao_1.OfferDao,
        dao_1.TaskerDao,
        task_dao_1.TaskDao,
        onesignal_1.OneSignalApiHandler])
], OfferService);
