import { autoInjectable } from 'tsyringe';

import { CouponDao } from '../DB/dao';
import { ICoupon } from '../interfaces';

@autoInjectable()
class CouponService {
  constructor(private couponDao: CouponDao) {}

  async createCoupon(coupon: ICoupon) {
    return await this.couponDao.create(coupon);
  }
}

export { CouponService };
