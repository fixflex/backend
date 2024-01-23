import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createCategoryValidator = [
  //   "name": {
  //     "en": "cleaning",
  //     "ar": "تنظيف"
  // }
  check('name')
    .notEmpty()
    .withMessage('is_required')
    .isObject()
    .withMessage('must_be_object')
    .custom(value => {
      if (!value.en || !value.ar) throw new Error('invalid_input');
      return true;
    }),
  validatorMiddleware,
];
