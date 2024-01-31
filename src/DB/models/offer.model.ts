// task model implement the IOffer interface
import { Schema, model } from 'mongoose';

import { IOffer, OfferStatus } from '../../interfaces';

let offerSchema: Schema<IOffer> = new Schema(
  {
    taskerId: {
      type: String,
      ref: 'Tasker',
      required: true,
    },
    taskId: {
      type: String,
      ref: 'Task',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: OfferStatus,
      default: OfferStatus.PENDING,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 8000,
    },
    subMessages: [
      {
        userId: {
          type: String,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
          maxlength: 8000,
        },
      },
    ],
  },
  { timestamps: true }
);

let Offer = model<IOffer>('Offer', offerSchema);

export default Offer;
