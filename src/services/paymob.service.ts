import axios from 'axios';
import crypto from 'crypto';
import { autoInjectable } from 'tsyringe';

import { TaskDao } from '../DB/dao';
import { TransactionDao } from '../DB/dao/transaction.dao';
import env from '../config/validateEnv';
import HttpException from '../exceptions/HttpException';
import { IUser, PaymobTaskDetails } from '../interfaces';
import { ITransaction, PaymentMethod, TransactionType } from '../interfaces/transaction.interface';

@autoInjectable()
class PaymobService {
  constructor(private readonly transactionDao: TransactionDao, private readonly taskDao: TaskDao) {} // Replace with your actual DAO

  private async authenticate(): Promise<string> {
    const paymobToken = await axios.post('https://accept.paymob.com/api/auth/tokens', {
      api_key: env.PAYMOB_API_KEY,
    });
    return paymobToken.data.token as string;
  }

  private async createOrder(paymobToken: string, orderDetails: PaymobTaskDetails) {
    try {
      let existingOrder = await axios.post('https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry', {
        auth_token: paymobToken,
        merchant_order_id: orderDetails.taskId,
      });

      if (existingOrder.data.id) {
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
        // merchant_order_id: `${Math.floor(Math.random() * 1000)}${orderDetails.taskId}`, // TODO: fix this
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

  public async getTransactionInquiry(merchantOrderId: string) {
    const paymobToken = await this.authenticate();
    try {
      const response = await axios.post('https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry', {
        auth_token: paymobToken,
        merchant_order_id: merchantOrderId,
        // order_id: orderId,
      });
      return response.data;
    } catch (error: any) {
      console.log('from getTransactionInquiry', error.response.data);
      throw new Error(error);
    }
  }

  public async getTransactionById(transactionId: string) {
    const paymobToken = await this.authenticate();
    try {
      const response = await axios.get(`https://accept.paymob.com/api/acceptance/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${paymobToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log('from getTransactionById', error.response.data);
      throw new Error(error);
    }
  }

  public async voidTransaction(transactionId: string) {
    const paymobToken = await this.authenticate();
    try {
      const response = await axios.post(`https://accept.paymob.com/api/acceptance/void_refund/void?token=${paymobToken}`, {
        transaction_id: transactionId,
      });
      return response.data;
    } catch (error: any) {
      console.log('from voidTransaction', error.response.data);
      throw new Error(error);
    }
  }

  public async handleTransactionWebhook(transactionData: any, hmac: any = '') {
    try {
      const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id: objId,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order: { id: order_id, merchant_order_id },
        owner,
        pending,
        source_data: { pan: source_data_pan, sub_type: source_data_sub_type, type: source_data_type },
        success,
      } = transactionData;

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

      // console.log('transactionData ======================>>', transactionData);
      if (hmac) {
        const concatenedString = `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${objId}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${order_id}${owner}${pending}${source_data_pan}${source_data_sub_type}${source_data_type}${success}`;
        console.log('concatenedString ======================>>', { concatenedString });
        const hash = crypto.createHmac('sha512', env.PAYMOB_HMAC_SECRET).update(concatenedString).digest('hex');

        if (hash !== hmac) {
          console.log('hash !== req.query.hmac');
          console.log('hash ======================>>', hash);
          console.log('req.query.hmac ======================>>', hmac);
          throw new HttpException(400, 'hash !== req.query.hmac');
        }
      }
      const transaction: ITransaction = {
        transactionId: objId,
        amount: amount_cents / 100, // convert cents to EGP
        transactionType: transactionData.is_void
          ? TransactionType.VOID_TRANSACTION
          : transactionData.is_refund
          ? TransactionType.REFUND_TRANSACTION
          : TransactionType.ONLINE_TASK_PAYMENT,
        pinding: pending, // Typo: Should be 'pending' instead of 'pinding' according to your original code
        success,
        orderId: order_id,
        taskId: merchant_order_id, // Replace with your actual logic to get taskId
      };
      const newTransaction = await this.transactionDao.create(transaction);
      console.log('newTransaction ======================>>', newTransaction);

      if (success && transaction.transactionType === TransactionType.ONLINE_TASK_PAYMENT) {
        // Replace with your actual logic to update the task
        let taskId = transactionData.order.merchant_order_id;
        console.log('taskId ======================>>', taskId);
        if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
          taskId = transactionData.order.merchant_order_id.slice(3); //  TODO: remove this line
          console.log('taskId ======================>>', taskId);
        }
        const updatedTask = await this.taskDao.updateOneById(taskId, {
          paid: true,
          paymentMethod: PaymentMethod.ONLINE_PAYMENT,
        });
        console.log('updatedTask ======================>>', updatedTask);
      }

      return 'webhook received successfully';
    } catch (error: any) {
      console.log('error ======================>>', error);
      throw new Error(error);
    }
  }

  public async refundTransaction(transactionId: string, amount_cents: number) {
    const paymobToken = await this.authenticate();
    try {
      const response = await axios.post(`https://accept.paymob.com/api/acceptance/void_refund/refund`, {
        auth_token: paymobToken,
        transaction_id: transactionId,
        amount_cents,
      });
      return response.data;
    } catch (error: any) {
      console.log('from refundTransaction', error.response.data);
      throw new Error(error);
    }
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
