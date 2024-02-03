import { ICoupon } from '../../interfaces';
import { CouponModel } from '../models';
import BaseDAO from './baseDao';

class CouponDao extends BaseDAO<ICoupon> {
  constructor() {
    super(CouponModel);
  }

  //   async getCoupons(query: Query) {
  //     const countDocments = await CouponModel.countDocuments();
  //     let apiFeatures = new QueryBuilder<ICoupon>(CouponModel.find(), query)
  //       .filter()
  //       .sort('-createdAt')
  //       .limitFields()
  //       .paginate(countDocments);
  //     const pagination: IPagination | undefined = apiFeatures.pagination;
  //     const coupons = await apiFeatures.mongooseQuery.select('-__v');
  //     return { coupons, pagination };
  //   }
}

export { CouponDao };
