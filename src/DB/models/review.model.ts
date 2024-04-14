import { Schema, model } from 'mongoose';

import { IReview } from '../../interfaces';
import TaskerModel from './tasker.model';

let reviewSchema: Schema<IReview> = new Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
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

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (taskerId: string) {
  let stats = await this.aggregate([
    {
      $match: { taskerId },
    },
    {
      $group: {
        _id: '$taskerId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await TaskerModel.findByIdAndUpdate(
      taskerId,
      {
        ratingQuantity: stats[0].nRating,
        ratingAverage: stats[0].avgRating.toFixed(2),
      },
      { new: true }
    );
  }
};

// Call calcAverageRatingsAndQuantity after each review is created or updated
reviewSchema.post('save', async function () {
  // @ts-ignore // TODO : fix this error
  this.constructor.calcAverageRatingsAndQuantity(this.taskerId);
});

let ReviewModel = model<IReview>('Review', reviewSchema);

export { ReviewModel };
