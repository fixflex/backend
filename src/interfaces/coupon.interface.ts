import { Document } from 'mongoose';

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number; // Either percentage or fixed amount, depending on the type
  expirationDate: Date;
  maxUses: number; // Maximum number of times the coupon can be used
  remainingUses: number; // Remaining uses of the coupon
  minOrderAmount?: number; // Minimum order amount required to apply the coupon
  createdBy: string; // User ID of the creator (admin, etc.)
  createdAt: Date;
  updatedAt: Date;
}
