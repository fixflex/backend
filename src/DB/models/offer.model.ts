// task model implement the IOffer interface
import { Schema, model } from 'mongoose';

import { IOffer, OfferStatus } from '../../interfaces';

let offerSchema: Schema<IOffer> = new Schema(
  {
    taskerId: {
      type: String,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: String,
      ref: 'Offer',
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
    // images: [
    //   {
    //     url: String,
    //     publicId: String,
    //   },
    // ],
  },
  { timestamps: true }
);

let Offer = model<IOffer>('Offer', offerSchema);

export default Offer;
