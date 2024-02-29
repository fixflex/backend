import { Document } from 'mongoose';

export enum TransactionType {
  ONLINE_TASK_PAYMENT = 'ONLINE_TASK_PAYMENT',
  PLATFORM_COMMISSION = 'PLATFORM_COMMISSION',
  TASKER_WITHDRAWAL = 'TASKER_WITHDRAWAL',

  VOID_TRANSACTION = 'VOID_TRANSACTION',
  REFUND_TRANSACTION = 'REFUND_TRANSACTION',

  COMMISSION_PAYMENT = 'COMMISSION_PAYMENT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum PaymentMethod {
  CASH = 'CASH',
  ONLINE_PAYMENT = 'ONLINE_PAYMENT',
  // CARD = 'CARD',
  // WALLET = 'WALLET',
}

export interface ITransaction {
  transactionId: string;
  amount: number;
  transactionType: TransactionType;
  pinding: boolean;
  success: boolean;
  orderId: string;
  taskId?: string;
  taskerId?: string;
}

export interface ITransactionDocument extends ITransaction, Document {}
