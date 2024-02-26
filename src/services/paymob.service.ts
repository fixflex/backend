import axios from 'axios';

import env from '../config/validateEnv';
import { IUser, PaymobTaskDetails } from '../interfaces';

class PaymobService {
  private async authenticate(): Promise<string> {
    const paymobToken = await axios.post('https://accept.paymob.com/api/auth/tokens', {
      api_key: env.PAYMOB_API_KEY,
    });
    return paymobToken.data.token as string;
  }

  private async createOrder(paymobToken: string, orderDetails: PaymobTaskDetails) {
    // check if the order is already created
    // ​https://accept.paymobsolutions.com/api/ecommerce/orders/transaction_inquiry​"
    // {
    //   "auth_token": "Your Auth Token",
    //   "merchant_order_id":  "your merchant order ID",
    //   "order_id":  "Your Order ID"
    // }
    try {
      let existingOrder = await axios.post('https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry', {
        auth_token: paymobToken,
        merchant_order_id: orderDetails.taskId,
      });

      if (existingOrder.data.id) {
        // console.log('order already exists ====>> ', existingOrder.data.order);
        return existingOrder.data.order;
      }
    } catch (error: any) {
      // console.log('from createOrder', error.response.data);
    }

    try {
      const order = {
        auth_token: paymobToken,
        delivery_needed: 'false',
        amount_cents: orderDetails.amount * 100,
        currency: 'EGP',
        // merchant_order_id: `${Math.floor(Math.random() * 1000)}${offer._id.toString()}`, // TODO: fix this
        merchant_order_id: orderDetails.taskId,
        items: [],
        notify_user_with_email: true,
        data: orderDetails,
      };
      const orderResponse = await axios.post('https://accept.paymob.com/api/ecommerce/orders', order);
      return orderResponse.data;
    } catch (error: any) {
      console.log('from createOrder', error.response.data);
      throw new Error(error);
    }
  }

  private async generatePaymentToken(paymobToken: string, order: any, integrationId: number, user: IUser): Promise<any> {
    try {
      const paymentToken = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
        auth_token: paymobToken,
        amount_cents: order.amount_cents,
        currency: 'EGP',
        order_id: order.id,

        merchant_order_id: order.merchant_order_id,
        billing_data: {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email || 'NA',
          phone_number: user.phoneNumber || 'NA', //|| '+201111111111',
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
        // to add additional data to the payment token request body you can add it here as key value pairs and it will be added to the payment token request body
        transaction_type: 'for generation of payment token',
      });
      // console.log(paymentToken.data);
      return paymentToken.data.token as string;
    } catch (error: any) {
      console.log('from generatePaymentToken', error.response.data);
      throw new Error(error);
    }
  }
  private async getWalletPaymentLink(paymentToken: string, phoneNumber: string): Promise<any> {
    const response = await axios.post('https://accept.paymob.com/api/acceptance/payments/pay', {
      source: {
        identifier: phoneNumber,
        subtype: 'WALLET',
      },
      payment_token: paymentToken,
    });
    return response;
  }

  public async initiateCardPayment(orderDetails: PaymobTaskDetails) {
    try {
      const paymobToken = await this.authenticate();
      const order = await this.createOrder(paymobToken, orderDetails);

      // console.log('order card ====>> ', order);
      const paymentToken = await this.generatePaymentToken(paymobToken, order, env.PAYMOB_INTEGRATION_ID, orderDetails.user);
      return `https://accept.paymob.com/api/acceptance/iframes/826805?payment_token=${paymentToken}`;
    } catch (error: any) {
      // console.log(error.response.data);
      throw new Error(error);
    }
  }

  public async initiateWalletPayment(orderDetails: PaymobTaskDetails) {
    try {
      const paymobToken = await this.authenticate();
      const order = await this.createOrder(paymobToken, orderDetails);
      // console.log('order wallet ====>> ', order);
      const paymentToken = await this.generatePaymentToken(paymobToken, order, env.PAYMOB_INTEGRATION_ID_WALLET, orderDetails.user);
      const walletPayment = await this.getWalletPaymentLink(paymentToken, orderDetails.phoneNumber);
      if (walletPayment) {
        return walletPayment.data.redirect_url;
      }
    } catch (error: any) {
      console.log(error.response.data);
      throw new Error(error);
    }
  }
}

export { PaymobService };
