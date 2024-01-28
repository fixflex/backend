import { Schema, model } from 'mongoose';

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
    rating: {
      type: Number,
      max: 5,
      min: 0,
      default: 0,
    },
    completedTasks: {
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
  },
  { timestamps: true }
);
// Apply the geospatial index to the coordinates field inside the location object
// taskerSchema.index({ 'location.coordinates': '2dsphere' });
taskerSchema.index({ location: '2dsphere' });

let Tasker = model<ITasker>('Tasker', taskerSchema);

export default Tasker;
