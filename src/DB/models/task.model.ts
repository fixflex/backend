import { Schema, model } from 'mongoose';

import { ITask, TaskStatus, TaskTime } from '../../interfaces';
import { PaymentMethod } from '../../interfaces/transaction.interface';

let taskSchema: Schema<ITask> = new Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    taskerId: {
      type: String,
      ref: 'Tasker',
    },
    dueDate: {
      on: {
        type: Date,
      },
      before: {
        type: Date,
      },
      flexible: {
        type: Boolean,
      },
    },
    time: [
      {
        type: String,
        enum: TaskTime,
      },
    ],
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    details: {
      type: String,
      required: true,
      trim: true,
      maxlength: 8000,
    },
    imageCover: {
      url: String,
      publicId: {
        type: String,
        default: null,
      },
    },
    // TODO: check the max length of the images array should't be more than 5
    images: [
      {
        url: String,
        publicId: {
          type: String,
          default: null,
        },
      },
    ],
    categoryId: {
      type: String,
      ref: 'Category',
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.OPEN,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      online: {
        type: Boolean,
      },
    },
    city: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 5,
    },
    offers: [
      {
        type: String,
        ref: 'Offer',
      },
    ],
    acceptedOffer: {
      type: String,
      ref: 'Offer',
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.CASH,
    },
    commission: {
      type: Number,
      // default: 0,
    },
    commissionAfterDescount: {
      type: Number,
      // default: 0,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// Apply the geospatial index to the coordinates field inside the location object
// taskSchema.index({ 'location.coordinates': '2dsphere' });
taskSchema.index({ location: '2dsphere' });

//  Virtual populate the reviews on the task
taskSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'taskId',
  localField: '_id',
});

//  Virtual populate the offers on the task.
// taskSchema.virtual('offers', {
//   ref: 'Offer',
//   foreignField: 'taskId',
//   localField: '_id',
// });

let Task = model<ITask>('Task', taskSchema);

// invoiceSchema.plugin(require('mongoose-autopopulate'));

export default Task;

// TODO
//=====================================================
// If you plan on using this query heavily in your application,
// you should create an index that covers this query.
//=====================================================
