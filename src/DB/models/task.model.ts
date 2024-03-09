import { Schema, model } from 'mongoose';

import { ITask, TaskStatus, TaskTime } from '../../interfaces';
import { PaymentMethod } from '../../interfaces/transaction.interface';

let taskSchema: Schema<ITask> = new Schema(
  {
    // _id: {
    //   type: String,
    //   // make mongooes to generate the id instead of the default id
    //   default: () => {
    //     // return new Date().getTime().toString();
    //     // user mongoose types to generate the id
    //     return new Types.ObjectId().toString();
    //     // toHexString(); // 24 character hex string hexString means a string of 24 characters as a string if you remove the toHexString() it will return an object
    //     // toString vs toHexString => toString will return the object id as an object and toHexString will return the object id as a string
    //   },
    // },
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
// Query executed without index
// This query ran without an index.
// If you plan on using this query heavily in your application,
// you should create an index that covers this query.
//=====================================================
