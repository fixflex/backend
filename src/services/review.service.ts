import { autoInjectable } from 'tsyringe';

import { ReviewDao } from '../DB/dao/review.dao';
import { IReview, IReviewService } from '../interfaces';

@autoInjectable()
class ReviewServiec implements IReviewService {
  constructor(private readonly reviewDao: ReviewDao) {}
  createReview(review: IReview): Promise<IReview> {
    return this.reviewDao.create(review);
  }
}

export { ReviewServiec };
