import { Schema, model } from 'mongoose';

import { ITransaction, ITransactionDocument, TransactionType } from '../../interfaces/transaction.interface';

let transactionSchema: Schema<ITransactionDocument> = new Schema(
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
    // wallet: {
    //   phoneNumber: {
    //     type: String,
    //     minlength: 11,
    //     maxlength: 11,
    //   },
    // },
    pinding: {
      type: Boolean,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      ref: 'Task',
    },
  },
  { timestamps: true }
);

let TransactionModel = model<ITransaction>('Transaction', transactionSchema);

export { TransactionModel };
