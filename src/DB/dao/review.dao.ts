import { IReview } from '../../interfaces';
import { ReviewModel } from '../models';
import BaseDao from './base.dao';

class ReviewDao extends BaseDao<IReview> {
  constructor() {
    super(ReviewModel);
  }
}

export { ReviewDao };
