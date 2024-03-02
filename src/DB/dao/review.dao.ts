import { Query } from 'express-serve-static-core';

import { QueryBuilder } from '../../helpers';
import { IPagination, IReview } from '../../interfaces';
import { ReviewModel } from '../models';
import BaseDao from './base.dao';

class ReviewDao extends BaseDao<IReview> {
  constructor() {
    super(ReviewModel);
  }

  async getReviews(query: Query) {
    // const countDocments = await ReviewModel.countDocuments();

    let apiFeatures = new QueryBuilder<IReview>(ReviewModel.find(), query).filter();
    // .paginate(countDocments);

    const pagination: IPagination | undefined = apiFeatures.pagination;
    const reviews = await apiFeatures.mongooseQuery;
    // TODO: Make apiFeatures more generic to handle all the populate and select methods , by removing the select and populate methods from the apiFeatures and make them as a method in the QueryBuilder class
    // .select('-__v  -images  -imageCover  -details')
    // .populate('userId', 'firstName lastName  profilePicture');

    return { reviews, pagination };
  }
}

export { ReviewDao };
