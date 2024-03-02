import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { TaskDao } from '../DB/dao';
import { ReviewDao } from '../DB/dao/review.dao';
import HttpException from '../exceptions/HttpException';
import { IReview, IReviewService, TaskStatus } from '../interfaces';

@autoInjectable()
class ReviewServiec implements IReviewService {
  constructor(private readonly reviewDao: ReviewDao, private readonly taskDao: TaskDao) {}
  async createReview(review: IReview, userId: string) {
    // Step 1: check if the user is the task owner
    const task = await this.taskDao.getOneById(review.taskId);
    if (!task) throw new Error('task_not_found');
    if (task.userId !== userId) throw new HttpException(403, 'unauthorized');
    // Step 2: check if the task is completed
    if (task.status !== TaskStatus.COMPLETED) throw new HttpException(400, 'task_not_completed');
    // Step 3: check if the user has already reviewed the task
    // const reviewed = await this.reviewDao.getOne({ taskId: review.taskId, userId });
    // if (reviewed) throw new HttpException(400, 'already_reviewed');
    // Step 4: create the review and return it
    review.userId = userId;
    review.taskerId = task.taskerId!;
    return await this.reviewDao.create(review);
  }

  async getReviews(query: Query) {
    const { reviews, pagination } = await this.reviewDao.getReviews(query);
    return { reviews, pagination };
  }

  async getReviewById(reviewId: string) {
    return await this.reviewDao.getOneById(reviewId);
  }

  async updateReview(reviewId: string, review: IReview, userId: string) {
    // 1) check if the review exists and the user is the owner then update it
    const updatedReview = await this.reviewDao.updateOne({ _id: reviewId, userId }, review);
    if (!review) throw new HttpException(400, 'something_went_wrong');
    return updatedReview;
  }

  async deleteReview(reviewId: string, userId: string) {
    // 1) check if the review exists and the user is the owner then delete it
    const deletedReview = await this.reviewDao.deleteOne({ _id: reviewId, userId }); // this will delete the review where the id and the user id are matched
    if (!deletedReview) throw new HttpException(400, 'something_went_wrong');
    return deletedReview;
  }
}

export { ReviewServiec };
