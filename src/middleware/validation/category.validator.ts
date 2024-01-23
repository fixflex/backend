import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createCategoryValidator = [
  check('name').notEmpty().withMessage('is_required').isString().withMessage('must_be_a_string').isLength({ max: 255 }).withMessage('exceeds_max_length'),
  validatorMiddleware,
];
