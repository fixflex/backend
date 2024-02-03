// coupon.route.ts
import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { CouponController } from '../controllers';
import { UserType } from '../interfaces';
import { Routes } from '../interfaces/routes.interface';
import { allowedTo, authenticateUser } from '../middleware/auth.middleware';
import { createCouponValidator } from '../middleware/validation';

@autoInjectable()
class CouponRoute implements Routes {
  public path = '/coupons';
  public router = Router();

  constructor(private readonly couponController: CouponController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(`${this.path}`, authenticateUser, allowedTo(UserType.ADMIN));
    this.router.post(`${this.path}`, createCouponValidator, this.couponController.createCoupon);
    // this.router.get(`${this.path}`, this.couponController.getAllCoupons);
    // this.router.get(`${this.path}/:id`, isMongoId, this.couponController.getCouponById);
    // this.router.patch(`${this.path}/:id`, isMongoId, createCouponValidator, this.couponController.updateCoupon);
    // this.router.delete(`${this.path}/:id`, isMongoId, this.couponController.deleteCoupon);
  }
}

export { CouponRoute };
