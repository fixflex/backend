import { Document } from 'mongoose';

export enum TransactionType {
  ONLINE_TASK_PAYMENT = 'ONLINE_TASK_PAYMENT',
  PLATFORM_COMMISSION = 'PLATFORM_COMMISSION',
  TASKER_WITHDRAWAL = 'TASKER_WITHDRAWAL',
}

// export enum PaymentMethod {
//   CASH = 'CASH',
//   CARD = 'CARD',
//   WALLET = 'WALLET',
// }

export interface ITransaction {
  transactionId: string;
  amount: number;
  transactionType: TransactionType;
  wallet?: {
    phoneNumber: string;
  };
  pinding: boolean;
  success: boolean;
  orderId: string;
}

export interface ITransactionDocument extends ITransaction, Document {}
