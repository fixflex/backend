import { check } from 'express-validator';

import { CouponType } from '../../interfaces';
import validatorMiddleware from '../errors/validation.middleware';

export const createCouponValidator = [
  // ====================>>>>>>>>  required  <<<<<<<<<<<==================== //
  check('code').notEmpty().withMessage('code is required').isString().withMessage('code must be a string'),
  check('maxUses', 'maxUses is required')
    .notEmpty()
    .isNumeric()
    .withMessage('maxUses must be a number')
    .custom(maxUses => {
      if (maxUses < 0) {
        throw new Error('maxUses must be positive');
      }
      return true;
    }),
  check('value')
    .notEmpty()
    .withMessage('value is required')
    .isNumeric()
    .withMessage('value must be a number')
    .custom(value => {
      if (value < 0) {
        throw new Error('value must be positive');
      }
      return true;
    }),

  // ====================>>>>>>>>  optional  <<<<<<<<<<<==================== //
  check('type').optional().isIn(Object.values(CouponType)).withMessage('invalid coupon type'),

  validatorMiddleware,
];
