import { Schema, model } from 'mongoose';

import { CouponType, ICoupon } from '../../interfaces';

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(CouponType),
      default: CouponType.PERCENTAGE,
    },
    value: {
      // example: 10 for 10% or 100 for 100$
      type: Number,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
      // default: new Date() + 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    maxUses: {
      type: Number,
      required: true,
    },
    remainingUses: {
      type: Number,
      required: true,
    },
    minOrderAmount: {
      type: Number,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CouponModel = model<ICoupon>('Coupon', couponSchema);

export { CouponModel };
