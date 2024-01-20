import { check } from 'express-validator';

import validatorMiddleware from '../errors/validation.middleware';

export const createCategoryValidator = [
  check('name').notEmpty().withMessage('Category name is required').isString().withMessage('Category name must be a string'),
  validatorMiddleware,
];
