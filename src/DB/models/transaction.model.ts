import { Schema, model } from 'mongoose';

import { ITransaction, PaymentMethod, TransactionStatus, TransactionType } from '../../interfaces/transaction.interface';

let transactionSchema: Schema<ITransaction> = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: TransactionType,
      required: true,
    },
    status: {
      type: String,
      enum: TransactionStatus,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: PaymentMethod,
      required: true,
    },
    wallet: {
      phoneNumber: {
        type: String,
        minlength: 11,
        maxlength: 11,
      },
    },
  },
  { timestamps: true }
);

export default model<ITransaction>('Transaction', transactionSchema);
