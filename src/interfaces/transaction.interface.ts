//  transaction interface
import { Document, Schema } from 'mongoose';

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  COMMISSION = 'COMMISSION',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
  // VODAFONE_CASH = 'VODAFONE_CASH',
  // ETISALAT_CASH = 'ETISALAT_CASH',
  // ORANGE_CASH = 'ORANGE_CASH',
  // FAWRY = 'FAWRY',
}

export enum CommissionType {
  PLATEFORM = 'PLATEFORM',
  TASKER = 'TASKER',
}

export interface ITransaction extends Document {
  task: { type: Schema.Types.ObjectId; ref: 'Task' };
  tasker: { type: Schema.Types.ObjectId; ref: 'Tasker' };
  amount: number;
  transactionType: TransactionType;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  commissionType: CommissionType;
}

export interface IWithdrawal extends Document {
  task: { type: Schema.Types.ObjectId; ref: 'Task' };
  tasker: { type: Schema.Types.ObjectId; ref: 'Tasker' };
  amount: number;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
}

// payment: {
//   // method: PaymentMethod;
//   // card: {
//   //   cardNumber: string;
//   //   cardHolderName: string;
//   //   expiryDate: string;
//   //   cvc: string;
//   // };
//   // vodafoneCash: {
//   //   phoneNumber: string;
//   //   pin: string;
//   // };
//   status: PaymentStatus;
//   amount: number;
//   transactionId: string;
// };
