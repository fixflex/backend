// coupon controller
import { autoInjectable } from 'tsyringe';

import { Request, Response } from '../helpers';
import { ICoupon } from '../interfaces';
// import { ICouponController } from '../interfaces';
import { CouponService } from '../services';

@autoInjectable()
class CouponController {
  constructor(private readonly couponService: CouponService) {}

  createCoupon = async (req: Request<ICoupon>, res: Response) => {
    req.body.createdBy = req.user._id;
    req.body.remainingUses = req.body.maxUses;

    const coupon = await this.couponService.createCoupon(req.body);
    res.status(201).json({ data: coupon, success: true, message: 'coupon_created' });
  };
}

export { CouponController };
