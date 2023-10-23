import { Document, Schema, model } from 'mongoose';

import { ITasker } from '../../../interfaces/user.interface';

let taskerSchema: Schema<ITasker & Document> = new Schema(
  {
    userId: {
      unique: true,
      type: String,
      ref: 'User',
      required: true,
    },
    services: [
      {
        type: String,
        ref: 'Service',
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
        default: [0, 0],
      },
    },

    bio: String,
  },
  { timestamps: true }
);
// Apply the geospatial index to the coordinates field inside the location object
// taskerSchema.index({ 'location.coordinates': '2dsphere' });
taskerSchema.index({ location: '2dsphere' });

let Tasker = model<ITasker & Document>('Tasker', taskerSchema);

export default Tasker;
