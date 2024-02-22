import { Query } from 'express-serve-static-core';

import { QueryBuilder } from '../../helpers';
import { IOffer, IPagination, ITasker } from '../../interfaces';
import OfferModel from '../models/offer.model';
import BaseDao from './base.dao';

class OfferDao extends BaseDao<IOffer> {
  constructor() {
    super(OfferModel);
  }

  async getAllOffersss() {
    //  make nested populate to populate the offers the taskerId for each offer
    const offers = await this.model
      .find({ _id: '65d35c774e68ff390291fc64' })
      .populate<{ taskerId: ITasker }>({
        path: 'taskerId',
        populate: {
          path: 'userId',
          select: 'firstName', // Add this line to select the 'firstName' field
        },
      })
      .select('-__v');
    console.log(offers[0].taskerId.userId);
    return offers;
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
