import axios from 'axios';

import env from '../config/validateEnv';

class PaymobService {
  private static async getPaymobToken() {
    const paymobToken = await axios.post('https://accept.paymob.com/api/auth/tokens', {
      api_key: env.PAYMOB_API_KEY,
    });
    return paymobToken.data.token;
  }

  private static async createOrder(paymobToken: string, offer: any) {
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
    const orderResponse = await axios.post('https://accept.paymob.com/api/ecommerce/orders', order);
    return orderResponse.data;
  }

  private static async getPaymentToken(paymobToken: string, order: any, integrationId: number) {
    const paymentToken = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
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

  private static async getPaymentTokenWallet(paymentToken: string) {
    try {
      const response = await axios.post('https://accept.paymob.com/api/acceptance/payments/pay', {
        source: {
          identifier: '01010101010',
          subtype: 'WALLET',
        },
        payment_token: paymentToken,
      });
      return response;
    } catch (error: any) {
      //   throw new Error(error);
      console.log(error.response.data);
    }
  }

  public static async initiateCardPayment(offer: any) {
    const paymobToken = await this.getPaymobToken();
    const order = await this.createOrder(paymobToken, offer);
    // console.log('order card ====>> ', order);
    const paymentToken = await this.getPaymentToken(paymobToken, order.id, env.PAYMOB_INTEGRATION_ID);
    return `https://accept.paymob.com/api/acceptance/iframes/826805?payment_token=${paymentToken.token}`;
  }

  public static async initiateWalletPayment(offer: any) {
    const paymobToken = await this.getPaymobToken();
    const order = await this.createOrder(paymobToken, offer);
    // console.log('order wallet ====>> ', order);
    const paymentToken = await this.getPaymentToken(paymobToken, order, env.PAYMOB_INTEGRATION_ID_WALLET);
    const walletPayment = await this.getPaymentTokenWallet(paymentToken.token);
    if (walletPayment) {
      return walletPayment.data;
    }
  }
}

export { PaymobService };
