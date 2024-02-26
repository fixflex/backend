import { Document } from 'mongoose';

// export enum TransactionType {
//   USER_TO_PLATFORM = 'USER_TO_PLATFORM ',
//   TASKER_TO_PLATFORM = 'TASKER_TO_PLATFORM ',
//   PLATFORM_TO_TASKER = 'PLATFORM_TO_TASKER ',
//   // REFUND = 'REFUND',
// }

export enum TransactionType {
  ONLINE_TASK_PAYMENT = 'ONLINE_TASK_PAYMENT',
  PLATFORM_COMMISSION = 'PLATFORM_COMMISSION',
  TASKER_WITHDRAWAL = 'TASKER_WITHDRAWAL',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
}

export interface ITransaction extends Document {
  transactionId: string;
  amount: number;
  transactionType: TransactionType;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  wallet?: {
    phoneNumber: string;
  };
}
