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
    bio: String,
  },
  { timestamps: true }
);

let Tasker = model<ITasker & Document>('Tasker', taskerSchema);

export default Tasker;
