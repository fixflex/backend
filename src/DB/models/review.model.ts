import { Schema, model } from 'mongoose';

import { IReview } from '../../interfaces';

let reviewSchema: Schema<IReview> = new Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: String,
      ref: 'Task',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let ReviewModel = model<IReview>('Review', reviewSchema);

export { ReviewModel };
