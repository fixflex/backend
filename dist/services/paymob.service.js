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
exports.PaymobService = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const tsyringe_1 = require("tsyringe");
const dao_1 = require("../DB/dao");
const transaction_dao_1 = require("../DB/dao/transaction.dao");
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const transaction_interface_1 = require("../interfaces/transaction.interface");
let PaymobService = class PaymobService {
    constructor(transactionDao, taskerDao, taskDao) {
        this.transactionDao = transactionDao;
        this.taskerDao = taskerDao;
        this.taskDao = taskDao;
    } // Replace with your actual DAO
    async authenticate() {
        const paymobToken = await axios_1.default.post('https://accept.paymob.com/api/auth/tokens', {
            api_key: validateEnv_1.default.PAYMOB_API_KEY,
        });
        return paymobToken.data.token;
    }
    async createOrder(paymobToken, orderDetails) {
        try {
            let existingOrder = await axios_1.default.post('https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry', {
                auth_token: paymobToken,
                merchant_order_id: orderDetails.taskId ? orderDetails.taskId : orderDetails.taskerId,
            });
            if (existingOrder.data.id) {
                return existingOrder.data.order;
            }
        }
        catch (error) {
            // console.log('from createOrder', error.response.data);
        }
        try {
            const order = {
                auth_token: paymobToken,
                delivery_needed: 'false',
                amount_cents: orderDetails.amount * 100,
                currency: 'EGP',
                // merchant_order_id: `${Math.floor(Math.random() * 1000)}${orderDetails.taskId}`, // TODO: fix this
                merchant_order_id: orderDetails.taskId ? orderDetails.taskId : orderDetails.taskerId,
                items: [],
                notify_user_with_email: true,
                data: orderDetails,
            };
            const orderResponse = await axios_1.default.post('https://accept.paymob.com/api/ecommerce/orders', order);
            return orderResponse.data;
        }
        catch (error) {
            console.log('from createOrder', error.response.data);
            throw new Error(error);
        }
    }
    async generatePaymentToken(paymobToken, order, integrationId, user) {
        try {
            const paymentToken = await axios_1.default.post('https://accept.paymob.com/api/acceptance/payment_keys', {
                auth_token: paymobToken,
                amount_cents: order.amount_cents,
                currency: 'EGP',
                order_id: order.id,
                merchant_order_id: order.merchant_order_id,
                billing_data: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email || 'NA',
                    phone_number: user.phoneNumber || 'NA',
                    apartment: 'NA',
                    floor: 'NA',
                    street: 'NA',
                    building: 'NA',
                    shipping_method: 'NA',
                    postal_code: 'NA',
                    city: 'NA',
                    country: 'NA',
                    state: 'NA',
                },
                integration_id: integrationId,
                lock_order_when_paid: 'false',
            });
            return paymentToken.data.token;
        }
        catch (error) {
            console.log('from generatePaymentToken', error.response.data);
            throw new Error(error);
        }
    }
    async getWalletPaymentLink(paymentToken, phoneNumber) {
        const response = await axios_1.default.post('https://accept.paymob.com/api/acceptance/payments/pay', {
            source: {
                identifier: phoneNumber,
                subtype: 'WALLET',
            },
            payment_token: paymentToken,
        });
        return response;
    }
    async getTransactionInquiry(merchantOrderId) {
        const paymobToken = await this.authenticate();
        try {
            const response = await axios_1.default.post('https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry', {
                auth_token: paymobToken,
                merchant_order_id: merchantOrderId,
                // order_id: orderId,
            });
            return response.data;
        }
        catch (error) {
            console.log('from getTransactionInquiry', error.response.data);
            throw new Error(error);
        }
    }
    async getTransactionById(transactionId) {
        const paymobToken = await this.authenticate();
        try {
            const response = await axios_1.default.get(`https://accept.paymob.com/api/acceptance/transactions/${transactionId}`, {
                headers: {
                    Authorization: `Bearer ${paymobToken}`,
                },
            });
            return response.data;
        }
        catch (error) {
            console.log('from getTransactionById', error.response.data);
            throw new Error(error);
        }
    }
    async voidTransaction(transactionId) {
        const paymobToken = await this.authenticate();
        try {
            const response = await axios_1.default.post(`https://accept.paymob.com/api/acceptance/void_refund/void?token=${paymobToken}`, {
                transaction_id: transactionId,
            });
            return response.data;
        }
        catch (error) {
            console.log('from voidTransaction', error.response.data);
            throw new Error(error);
        }
    }
    async handleTransactionWebhook(transactionData, hmac) {
        try {
            const { amount_cents, created_at, currency, error_occured, has_parent_transaction, id: objId, integration_id, is_3d_secure, is_auth, is_capture, is_refunded, is_standalone_payment, is_voided, order: { id: order_id }, owner, pending, source_data: { pan: source_data_pan, sub_type: source_data_sub_type, type: source_data_type }, success, } = transactionData;
            if (hmac) {
                const concatenedString = `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${objId}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${order_id}${owner}${pending}${source_data_pan}${source_data_sub_type}${source_data_type}${success}`;
                // console.log('concatenedString ======================>>', { concatenedString });
                const hash = crypto_1.default.createHmac('sha512', validateEnv_1.default.PAYMOB_HMAC_SECRET).update(concatenedString).digest('hex');
                if (hash !== hmac) {
                    console.log('hash !== req.query.hmac');
                    console.log('hash ======================>>', hash);
                    console.log('req.query.hmac ======================>>', hmac);
                    throw new HttpException_1.default(400, 'hash !== req.query.hmac');
                }
            }
            const transaction = {
                transactionId: objId,
                amount: amount_cents / 100,
                transactionType: transactionData.order.data.transactionType,
                pinding: pending,
                success,
                orderId: order_id,
                taskId: transactionData.order.data.taskId,
                taskerId: transactionData.order.data.merchant_order_id,
            };
            // const newTransaction =
            await this.transactionDao.create(transaction);
            // console.log('newTransaction ======================>>', newTransaction);
            if (success && transaction.transactionType === transaction_interface_1.TransactionType.ONLINE_TASK_PAYMENT) {
                // Replace with your actual logic to update the task
                let taskId = transactionData.order.data.taskId;
                // console.log('taskId ======================>>', taskId);
                // if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
                //   taskId = transactionData.order.merchant_order_id.slice(3); //  TODO: remove this line
                //   console.log('taskId ======================>>', taskId);
                // }
                // const updatedTask =
                await this.taskDao.updateOneById(taskId, {
                    paid: true,
                    paymentMethod: transaction_interface_1.PaymentMethod.ONLINE_PAYMENT,
                });
                // console.log('updatedTask ======================>>', updatedTask);
            }
            else if (success && transaction.transactionType === transaction_interface_1.TransactionType.COMMISSION_PAYMENT) {
                // get the tasker by id and update the notPaidTasks to be empty array
                const tasker = await this.taskerDao.updateOneById(transaction.taskerId, {
                    $set: { notPaidTasks: [] },
                });
                // console.log('tasker ======================>>', tasker);
                if (!tasker)
                    throw new HttpException_1.default(400, 'tasker_not_found');
            }
            return 'webhook received successfully';
        }
        catch (error) {
            console.log('error ======================>>', error);
            throw new Error(error);
        }
    }
    async refundTransaction(transactionId, amount_cents) {
        const paymobToken = await this.authenticate();
        try {
            const response = await axios_1.default.post(`https://accept.paymob.com/api/acceptance/void_refund/refund`, {
                auth_token: paymobToken,
                transaction_id: transactionId,
                amount_cents,
            });
            return response.data;
        }
        catch (error) {
            console.log('from refundTransaction', error.response.data);
            throw new Error(error);
        }
    }
    async initiateCardPayment(orderDetails) {
        try {
            const paymobToken = await this.authenticate();
            const order = await this.createOrder(paymobToken, orderDetails);
            // console.log('order card ====>> ', order);
            const paymentToken = await this.generatePaymentToken(paymobToken, order, validateEnv_1.default.PAYMOB_INTEGRATION_ID, orderDetails.user);
            return `https://accept.paymob.com/api/acceptance/iframes/826805?payment_token=${paymentToken}`;
        }
        catch (error) {
            console.log('from initiateCardPayment', error.response.data);
            throw new Error(error);
        }
    }
    async initiateWalletPayment(orderDetails) {
        try {
            const paymobToken = await this.authenticate();
            const order = await this.createOrder(paymobToken, orderDetails);
            // console.log('order wallet ====>> ', order);
            const paymentToken = await this.generatePaymentToken(paymobToken, order, validateEnv_1.default.PAYMOB_INTEGRATION_ID_WALLET, orderDetails.user);
            const walletPayment = await this.getWalletPaymentLink(paymentToken, orderDetails.phoneNumber);
            if (walletPayment) {
                return walletPayment.data.redirect_url;
            }
        }
        catch (error) {
            console.log(error.response.data);
            throw new Error(error);
        }
    }
};
exports.PaymobService = PaymobService;
exports.PaymobService = PaymobService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [transaction_dao_1.TransactionDao, dao_1.TaskerDao, dao_1.TaskDao])
], PaymobService);
