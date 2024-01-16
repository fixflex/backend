// task model implement the IOffer interface
import { Schema, model } from 'mongoose';

import { IOffer } from '../../interfaces/offer.interface';

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
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 6000,
    },
    subMessages: [
      {
        sender: {
          type: String,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
          maxlength: 6000,
        },
      },
    ],
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
  },
  { timestamps: true }
);

let Offer = model<IOffer>('Offer', offerSchema);

export default Offer;
