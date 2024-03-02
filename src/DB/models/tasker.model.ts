import { Schema, model } from 'mongoose';

import env from '../../config/validateEnv';
import { ITasker } from '../../interfaces/tasker.interface';

let taskerSchema: Schema<ITasker> = new Schema(
  {
    userId: {
      unique: true,
      type: String,
      ref: 'User',
      required: true,
    },

    categories: [
      {
        type: String,
        ref: 'Category',
      },
    ],
    ratingAverage: {
      type: Number,
      max: 5,
      min: 0,
      default: 0,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        // [longitude, latitude] [x, y]
        type: [Number],
        required: true,
      },
      radius: {
        type: Number,
        default: 50000, // 50 km
      },
    },
    bio: String,
    phoneNumber: {
      unique: true,
      type: String,
      required: true,
      minlength: 11,
      maxlength: 11,
    },
    notPaidTasks: [
      {
        type: String,
        ref: 'Task',
      },
    ],
    totalCanceledTasks: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    netEarnings: {
      type: Number,
      default: 0,
    },
    completedTasks: [
      {
        type: String,
        ref: 'Task',
      },
    ],
    commissionRate: {
      type: Number,
      default: env.COMMISSION_RATE,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// Apply the geospatial index to the coordinates field inside the location object
// taskerSchema.index({ 'location.coordinates': '2dsphere' });
taskerSchema.index({ location: '2dsphere' });

// Virtual Properties
taskerSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'taskerId',
});

let Tasker = model<ITasker>('Tasker', taskerSchema);

export default Tasker;
