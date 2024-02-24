"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymobService = void 0;
const axios_1 = __importDefault(require("axios"));
const validateEnv_1 = __importDefault(require("../config/validateEnv"));
class PaymobService {
    static async getPaymobToken() {
        const paymobToken = await axios_1.default.post('https://accept.paymob.com/api/auth/tokens', {
            api_key: validateEnv_1.default.PAYMOB_API_KEY,
        });
        return paymobToken.data.token;
    }
    static async createOrder(paymobToken, offer) {
        const order = {
            auth_token: paymobToken,
            delivery_needed: 'false',
            amount_cents: offer.price * 100,
            currency: 'EGP',
            merchant_order_id: `${Math.floor(Math.random() * 1000)}${offer._id}`,
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
        const orderResponse = await axios_1.default.post('https://accept.paymob.com/api/ecommerce/orders', order);
        return orderResponse.data;
    }
    static async getPaymentToken(paymobToken, order, integrationId) {
        const paymentToken = await axios_1.default.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            auth_token: paymobToken,
            amount_cents: 96000,
            currency: 'EGP',
            order_id: order.id,
            billing_data: {
                first_name: 'Mohamed',
                last_name: 'Ali',
                email: 'ahmed4321mustafa5@gmail.com',
                phone_number: '+201111111111',
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
        return paymentToken.data;
    }
    static async getPaymentTokenWallet(paymentToken) {
        try {
            const response = await axios_1.default.post('https://accept.paymob.com/api/acceptance/payments/pay', {
                source: {
                    identifier: '01010101010',
                    subtype: 'WALLET',
                },
                payment_token: paymentToken,
            });
            return response;
        }
        catch (error) {
            //   throw new Error(error);
            console.log(error.response.data);
        }
    }
    static async initiateCardPayment(offer) {
        const paymobToken = await this.getPaymobToken();
        const order = await this.createOrder(paymobToken, offer);
        // console.log('order card ====>> ', order);
        const paymentToken = await this.getPaymentToken(paymobToken, order.id, validateEnv_1.default.PAYMOB_INTEGRATION_ID);
        return `https://accept.paymob.com/api/acceptance/iframes/826805?payment_token=${paymentToken.token}`;
    }
    static async initiateWalletPayment(offer) {
        const paymobToken = await this.getPaymobToken();
        const order = await this.createOrder(paymobToken, offer);
        // console.log('order wallet ====>> ', order);
        const paymentToken = await this.getPaymentToken(paymobToken, order, validateEnv_1.default.PAYMOB_INTEGRATION_ID_WALLET);
        const walletPayment = await this.getPaymentTokenWallet(paymentToken.token);
        if (walletPayment) {
            return walletPayment.data;
        }
    }
}
exports.PaymobService = PaymobService;
