import { Query } from 'express-serve-static-core';

import { QueryBuilder } from '../../helpers';
import { IOffer, IPagination } from '../../interfaces';
import OfferModel from '../models/offer.model';
import BaseDao from './baseDao';

class OfferDao extends BaseDao<IOffer> {
  constructor() {
    super(OfferModel);
  }

  async getOffers(query: Query) {
    const countDocments = await OfferModel.countDocuments();
    let apiFeatures = new QueryBuilder<IOffer>(OfferModel.find(), query).filter().sort('-createdAt').limitFields().paginate(countDocments);
    const pagination: IPagination | undefined = apiFeatures.pagination;
    const offers = await apiFeatures.mongooseQuery.select('-__v');
    // .populate('taskId')
    // .populate({ path: 'taskerId', populate: { path: 'userId' } });
    return { offers, pagination };
  }
}

export { OfferDao };
