import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createCategoryValidator = [
  check('name').notEmpty().withMessage('is_required').isString().withMessage('invalid_input').isLength({ max: 255 }).withMessage('exceeds_max_length'),
  validatorMiddleware,
];
